import json
import uuid

from django.conf import settings
from django.db import models
from account.models import Account
from datetime import datetime
from django.utils.translation import ugettext_lazy as _
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# class SupportGroup(models.Model):
#     name = models.CharField(_("name"), max_length=225)
#     agents = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='agent_support_groups')
#     supervisors = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='supervisor_support_groups')
#
#     def __str__(self):
#         return f'{self.name}'
#
#     class Meta:
#         verbose_name = _('Support group')
#         verbose_name_plural = _('Support groups')


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f"Uploaded_Files/user_{instance.uploaded_by}/{filename}"


class UploadedFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    uploaded_by = models.CharField(_("name"), max_length=255, null=True, blank=True)
    file = models.FileField(verbose_name=_("File"), blank=False, null=False, upload_to=user_directory_path)
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name=_("Upload date"))

    def __str__(self):
        return str(self.file.name)

    def get_file_name(self):
        return self.file.name.split("/")[-1]


class RoomManager(models.Manager):
    def get_query_set(self):
        return super(RoomManager, self).get_query_set().filter(ended=None)


class Room(models.Model):
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,
                          editable=False)
    name = models.CharField(_("name"), max_length=255)
    details = models.TextField(blank=True)
    started = models.DateTimeField(auto_now=True)
    ended = models.DateTimeField(null=True, blank=True)
    agents = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, related_name='chats',
                               on_delete=models.CASCADE)
    objects = models.Manager()
    active = RoomManager()
    last_sent_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.started}:{self.name}'

    def end(self):
        self.ended = datetime.now()
        self.save()

    def save(self, updateChatList=True, *args, **kwargs):
        from .serializers import RoomSerializer
        channel_layer = get_channel_layer()
        if updateChatList:
            super(Room, self).save(*args, **kwargs)
            chatStartMsg = Message.objects.create(room=self, message=f'Chat Started', type='started_info')
            preChatFormMsg = Message.objects.create(room=self, name=self.name,  message=self.details, type='chat_form')
            greetingMsg = Message.objects.create(room=self, message=f'Hello, How may I help you?', name='greetingMsg' )
            chatStartMsg.save()
            preChatFormMsg.save()
            greetingMsg.save()

            message = {
                'command': 'update_chat_list',
                'message': {
                    'chatRoom': RoomSerializer(self).data,
                }
            }
            async_to_sync(channel_layer.group_send)(
                'user', {
                    'type': 'chat_message',
                    'message': message
                }
            )
        else:
            super(Room, self).save(*args, **kwargs)

    def get_agents(self):
        return self.agents

    def unread_messages(self):
        total_unread_messages = Message.objects.filter(room=self, agent=None, receiverHasRead=False)
        return total_unread_messages.count()

    def message_read_true(self, sender):
        if sender == 'agent':
            total_unread_messages = Message.objects.filter(room=self, agent__isnull=True, receiverHasRead=False)
        else:
            total_unread_messages = Message.objects.filter(room=self, agent__isnull=False, receiverHasRead=False)
        for i in total_unread_messages:
            i.receiverHasRead = True
        Message.objects.bulk_update(total_unread_messages, ['receiverHasRead'])
        # channel_layer = get_channel_layer()
        # message = {
        #     'command': 'update_chat_list',
        #     'message': 'Successfully updated'
        # }
        # async_to_sync(channel_layer.group_send)(
        #     'user', {
        #         'type': 'chat_message',
        #         'message': message
        #     }
        # )

    def last_message(self):
        last_msg = Message.objects.filter(room=self).order_by('-sent')[:1]
        if last_msg:
            message = last_msg[0].message
            sent_time = last_msg[0].sent

            result = {
                'message': message,
                'sent_time': str(sent_time)
            }
            return result
        else:
            result = {
                'message': 'Compose Message...',
                'sent_time': self.started
            }
            return result

    class Meta:
        verbose_name = _('Chat')
        verbose_name_plural = _('Chats')


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    name = models.CharField(max_length=255, blank=True, null=True)
    agent = models.ForeignKey(Account, on_delete=models.CASCADE, blank=True, null=True)
    message = models.TextField()
    sent = models.DateTimeField(auto_now_add=True)
    receiverHasRead = models.BooleanField(default=False)
    type = models.CharField(default='chat', max_length=50)
    file = models.ForeignKey(UploadedFile, related_name='message', on_delete=models.DO_NOTHING, verbose_name=_("File"),
                             blank=True, null=True)

    def __str__(self):
        return f'{self.sent}: "{self.message}" in Room "{self.room}"'

    def save(self, *args, **kwargs):
        super(Message, self).save(*args, **kwargs)
        room = Room.objects.get(id=self.room.id)
        room.last_sent_time = self.sent
        room.save(updateChatList=False)

    def get_name(self):
        if self.agent:
            return self.agent.firstname or self.agent.Username
        else:
            return self.name

    class Meta:
        verbose_name = _('Chat message')
        verbose_name_plural = _('Chat messages')
