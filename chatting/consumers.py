import json

from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message, Room
from .views import *
from channels.db import database_sync_to_async

User = get_user_model()


# class EventConsumer(WebsocketConsumer):
#
#     def connect(self):
#         # user_id = self.scope['url_route']['kwargs']['support_group_name']
#         try:
#             # self.user_group_name = 'user_%s' % user_id
#             self.user_group_name = 'user'
#             async_to_sync(self.channel_layer.group_add)(
#                 self.user_group_name,
#                 self.channel_name
#             )
#             self.accept()
#         except Exception as ex:
#             self.disconnect(500)
#             raise ex
#
#     def disconnect(self, code):
#         async_to_sync(self.channel_layer.group_discard)(
#             self.user_group_name,
#             self.channel_name,
#         )
#
#     def receive(self, text_data=None, bytes_data=None):
#         data = json.loads(text_data)
#         self.commands[data['command']](data)
#
#     def update_chat_list(self, data):
#         pass
#
#     def live_update(self, event):
#         message = event['message']
#         self.send(text_data=json.dumps(message))
#
#     commands = {
#         'update_chat_list': update_chat_list
#     }


class ChatConsumer(WebsocketConsumer):
    """
    This function accepts valid web socket connection which takes the room_uuid as parameter provided in the websocket
    url and adds the current chat session in the channel layer.

    """

    def connect(self):
        room_id = self.scope['url_route']['kwargs']['room_uuid']
        try:
            room = get_room(room_id)
            self.room_group_name = 'chat_%s' % room_id
            self.user_group_name = 'user'
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
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
            self.set_message_read(data={'chatId':room_id, 'sender':'agent'})
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
        # current_chat = get_room(self.scope['url_route']['kwargs']['room_uuid'], self.multitenant, self.schema_name)
        # current_chat.end()
        # current_chat.save()
        # user_contact = get_user_contact(self.scope['user'], self.multitenant, self.schema_name)
        # if user_contact:
        #     user = self.scope['user']
        # else:
        #     user = get_room(self.room_id, self.multitenant, self.schema_name)
        #     user = user.name
        # message = f'{user} left the chat. This chat has ended'
        # content = {
        #     'command': 'end_chat',
        #     'message': message,
        # }
        # self.send_chat_message(content)

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )
        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name,
            self.channel_name,
        )

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
            'message': {
                'by': data['by'],
            }
        }
        return self.send_chat_message(content)

    def finished_typing(self, data):
        content = {
            'command': 'finished_typing',
            'message': {
                'by': data['by'],
            }
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

    """
        When any message is received, the receive() function looks up on this dictionary to call the right function, as
        received in the command data.
    """
    commands = {
        # 'fetch_messages': fetch_messages,
        'upload_file': upload_file,
        'new_message': new_message,
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
                'id': str(message.id),
                'name': message.agent.username,
                'message': message.message,
                'sent': str(message.sent)
            }
        except:
            return {
                'id': str(message.id),
                'name': message.room.name,
                'message': message.message,
                'sent': str(message.sent)
            }

    """
        Send the chat message to the channel layer which then is received in the frontend
    """

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
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
