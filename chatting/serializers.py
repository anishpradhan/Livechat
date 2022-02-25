import os.path

from rest_framework import serializers
from .models import *


class RoomSerializer(serializers.ModelSerializer):

    last_message_field = serializers.JSONField(source='last_message', read_only=True)
    total_unread_messages = serializers.CharField(source='unread_messages', read_only=True)

    class Meta:
        model = Room

        fields = ['id', 'name', 'support_group', 'details', 'started', 'last_sent_time', 'last_message_field', 'total_unread_messages']


class MessageSerializer(serializers.ModelSerializer):

    # sent_field = serializers.CharField(source='formatted_date', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'name','agent','message','file','sent','receiverHasRead','type']


def serialize_file_model(m: UploadedFile):
    return {
        'id': str(m.id),
        'url': m.file.url,
        'size': m.file.size,
        'name': os.path.basename(m.get_file_name()),
        'uploaded_by': m.uploaded_by
    }
