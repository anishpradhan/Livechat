import json

from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message, Room
from .views import *
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings

User = get_user_model()


class EventConsumer(WebsocketConsumer):

    def connect(self):
        self.token = parse_qs(self.scope["query_string"].decode("utf8"))["token"][0]
        try:
            # This will automatically validate the token and raise an error if token is invalid
            UntypedToken(self.token)
        except (InvalidToken, TokenError) as e:
            # Token is invalid
            print(e)
            return None
        else:
            #  Then token is valid, decode it
            self.decoded_data = jwt_decode(self.token, settings.SECRET_KEY, algorithms=["HS256"])
            # Will return a dictionary like -
            # {
            #     "token_type": "access",
            #     "exp": 1568770772,
            #     "jti": "5c15e80d65b04c20ad34d77b6703251b",
            #     "user_id": 6
            # }

            # Get the user using ID
            self.user_id = self.decoded_data["user_id"]
            # self.user = get_user_model().objects.get(id = self.decoded_data["user_id"])
            # print(self.user.user_id)
            try:
                # self.user_group_name = 'user_%s' % user_id
                self.user_group_name = 'user'
                self.current_user_group_name = 'user' + str(self.user_id)
                async_to_sync(self.channel_layer.group_add)(
                    self.user_group_name,
                    self.channel_name
                )
                async_to_sync(self.channel_layer.group_add)(
                    self.current_user_group_name,
                    self.channel_name
                )
                self.accept()
            except Exception as ex:
                self.disconnect(500)
                raise ex

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name,
            self.channel_name,
        )
        async_to_sync(self.channel_layer.group_discard)(
            self.current_user_group_name,
            self.channel_name,
        )

    def receive(self, text_data=None):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def update_chat_list(self, data):
        content = {
            'command': 'update_chat_list',
            'message': 'eventConsumerTest'
        }
        return self.send_chat_message(content)

    def create_new_chatroom_session(self, data):
        chatroom = data['chatId']
        self.room_group_name = 'chat_%s' % chatroom
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

    def discard_chatroom_session(self, data):
        chatroom = data['chatId']
        self.room_group_name = 'chat_%s' % chatroom
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def new_message(self, data):
        user_contact = get_user_contact(data['from'])
        current_chat = get_room(data['chatId'])
        if user_contact:
            message = Message.objects.create(
                room=current_chat,
                agent=user_contact,
                message=data['message'])
        else:
            message = Message.objects.create(
                room=current_chat,
                name=current_chat.name,
                message=data['message'])
        message.save()
        total_unread_message = current_chat.unread_messages()

        content = {
            'command': 'new_message',
            'message': self.message_to_json(message),
            'total_unread': total_unread_message
        }
        return self.send_chat_message(content)

    def join_chat(self, data):
        agent_id = data['agentId']
        room = Room(id=data['chatId'])
        message = Message.objects.create(
            room=room,
            message=f'{agent_id} has joined the chat',
            type='info')
        print(self.message_to_json(message))
        content = {
            'command': 'join_chat',
            'chatId': data['chatId'],
            'agentId': agent_id,
            'joinedMsg': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    def is_typing(self, data):
        content = {
            'command': 'is_typing',
            'by': data['by'],
            'chatId': data['chatId']
        }
        print(data['chatId'])
        return self.send_chat_message(content)


    def finished_typing(self, data):
        content = {
            'command': 'finished_typing',
            'by': data['by'],
            'chatId': data['chatId']
        }
        return self.send_chat_message(content)


    def set_message_read(self, data):
        current_chat = get_room(data['chatId'])
        current_chat.message_read_true(data['sender'])
        content = {
            'command': 'has_read_status',
            'chatId': data['chatId'],
            'sender': data['sender']
        }
        return self.send_chat_message(content)


    commands = {
        'update_chat_list': update_chat_list,
        'create_new_chatroom_session': create_new_chatroom_session,
        'discard_chatroom_session': discard_chatroom_session,
        'new_message': new_message,
        'join_chat': join_chat,
        'is_typing': is_typing,
        'finished_typing': finished_typing,
        'set_message_read': set_message_read
    }


    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result


    def message_to_json(self, message):
        try:
            return {
                'id': message.id,
                'room': str(message.room.id),
                'name': message.agent.username,
                'agent': message.agent.id,
                'message': message.message,
                'file': message.file,
                'sent': str(message.sent),
                'receiverHasRead': message.receiverHasRead,
                'type': message.type
            }
        except Exception as e:
            print(e)
            return {
                'id': message.id,
                'room': str(message.room.id),
                'name': message.room.name,
                'agent': message.agent,
                'message': message.message,
                'file': message.file,
                'sent': str(message.sent),
                'receiverHasRead': message.receiverHasRead,
                'type': message.type


            }


    """
        Send the chat message to the channel layer which then is received in the frontend
    """


    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.user_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )


    def send_message(self, message):
        self.send(text_data=json.dumps(message))


    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))


class ChatConsumer(WebsocketConsumer):
    """
    This function accepts valid web socket connection which takes the room_uuid as parameter provided in the websocket
    url and adds the current chat session in the channel layer.

    """

    def connect(self):

        room_id = self.scope['url_route']['kwargs']['room_uuid']

        try:
            room = get_room(room_id)
            # self.room_group_name = 'chat_%s' % room_id
            self.user_group_name = 'user'
            self.agent_assigned_group_name = None
            # async_to_sync(self.channel_layer.group_add)(
            #     self.room_group_name,
            #     self.channel_name
            # )
            async_to_sync(self.channel_layer.group_add)(
                self.user_group_name,
                self.channel_name
            )

            # Send the 'user joined message on the front-end'
            user_contact = get_user_contact(self.scope['user'])
            if user_contact:
                user = self.scope['user']
            else:
                user = room.name
            # message = f'{user} joined the chat.'
            # content = {
            #     'command': 'set_message_read',
            #     # 'message': message,
            # }
            self.set_message_read(data={'chatId': room_id, 'sender': 'agent'})

            # self.send_chat_message(content)
            self.accept()

        # Disconnect if any exception occurs
        except Exception as ex:
            self.disconnect(500)
            raise ex

    """
        Discard the current chat session in the channel layer when the web socket is disconnected
    """

    def disconnect(self, close_code):

        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name,
            self.channel_name,
        )
        try:
            if self.agent_assigned_group_name:
                async_to_sync(self.channel_layer.group_discard)(
                    self.agent_assigned_group_name,
                    self.channel_name,
                )
        except:
            pass

    """
        This function executes when any message is received in the web socket
    """

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    """
        This function fetches the last 10 messages from the database and sends the message to the websocket.
    """

    # async def fetch_messages(self, data):
    #     messages = get_last_10_messages(data['chatId'])
    #     content = {
    #         'command': 'messages',
    #         'messages': self.messages_to_json(messages)
    #     }
    #     await self.send_message(content)

    def new_message(self, data):
        user_contact = get_user_contact(data['from'])
        current_chat = get_room(data['chatId'])
        if user_contact:
            message = Message.objects.create(
                room=current_chat,
                agent=user_contact,
                message=data['message'])
        else:
            message = Message.objects.create(
                room=current_chat,
                name=current_chat.name,
                message=data['message'])
        message.save()

        content = {
            'command': 'new_message',
            'message': self.message_to_json(message),
        }
        return self.send_chat_message(content)

    def join_chat(self, data):
        agent_id = data['agentId']
        self.agent_assigned_group_name = 'user' + str(agent_id)
        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name,
            self.channel_name,
        )
        async_to_sync(self.channel_layer.group_add)(
            self.agent_assigned_group_name,
            self.channel_name
        )
        content = {
            'command': 'join_chat',
            'chatId': data['chatId'],
            'agentId': agent_id,
        }
        return self.send_chat_message(content, agent_assigned_group_name=self.agent_assigned_group_name)

    def end_chat(self, data):
        current_chat = get_room(data['chatId'])
        current_chat.end()
        current_chat.save()
        name = data['left']
        message = '%s has left the chat.  This chat has ended.' % name
        content = {
            'command': 'end_chat',
            'message': message,
        }
        return self.send_chat_message(content)

    def upload_file(self, data):
        uploaded_by = get_user_contact(data['uploaded_by'])
        file = get_file_by_id(data['file_id'])
        current_chat = get_room(data['chatId'])
        if uploaded_by:
            message = Message.objects.create(
                room=current_chat,
                agent=uploaded_by,
                file=file)
        else:
            message = Message.objects.create(
                room=current_chat,
                file=file)
        message.save()
        content = {
            'command': 'uploaded_file',
            'message': {
                'id': str(message.id),
                'uploaded_by': data['uploaded_by'],
                'file_id': str(message.file.id),
                'file_name': message.file.get_file_name(),
                'timestamp': str(message.sent)
            }
        }
        return self.send_chat_message(content)

    def is_typing(self, data):
        content = {
            'command': 'is_typing',
            'by': data['by'],
            'chatId': data['chatId']
        }
        if self.agent_assigned_group_name:
            return self.send_chat_message(content, agent_assigned_group_name=self.agent_assigned_group_name)
        else:
            return self.send_chat_message(content)

    def finished_typing(self, data):
        content = {
            'command': 'finished_typing',
            'by': data['by'],
            'chatId': data['chatId']
        }
        if self.agent_assigned_group_name:
            return self.send_chat_message(content, agent_assigned_group_name=self.agent_assigned_group_name)
        else:
            return self.send_chat_message(content)

    def set_message_read(self, data):
        current_chat = get_room(data['chatId'])
        current_chat.message_read_true(data['sender'])
        content = {
            'command': 'has_read_status',
            'chatId': data['chatId'],
            'sender': data['sender']
        }
        return self.send_chat_message(content)

    """
        When any message is received, the receive() function looks up on this dictionary to call the right function, as
        received in the command data.
    """
    commands = {
        # 'fetch_messages': fetch_messages,
        'upload_file': upload_file,
        'new_message': new_message,
        'join_chat': join_chat,
        'end_chat': end_chat,
        'is_typing': is_typing,
        'finished_typing': finished_typing,
        'set_message_read': set_message_read
    }

    """
        Converts the dictionary message to json serializable format.
    """

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        try:
            return {
                'id': message.id,
                'room': str(message.room.id),
                'name': message.agent.username,
                'agent': message.agent.id,
                'message': message.message,
                'file': message.file,
                'sent': str(message.sent),
                'receiverHasRead': message.receiverHasRead,
                'type': message.type
            }
        except Exception as e:

            return {
                'id': message.id,
                'room': str(message.room.id),
                'name': message.room.name,
                'agent': message.agent,
                'message': message.message,
                'file': message.file,
                'sent': str(message.sent),
                'receiverHasRead': message.receiverHasRead,
                'type': message.type
            }

    """
        Send the chat message to the channel layer which then is received in the frontend
    """

    def send_chat_message(self, message, agent_assigned_group_name=None):
        if agent_assigned_group_name:
            async_to_sync(self.channel_layer.group_send)(
                agent_assigned_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )

        else:
            async_to_sync(self.channel_layer.group_send)(
                self.user_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )
        # async_to_sync(self.channel_layer.group_send)(
        #     self.user_group_name,
        #     {
        #         'type': 'chat_message',
        #         'message': message
        #     }
        # )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
