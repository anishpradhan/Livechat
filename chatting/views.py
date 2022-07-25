from django.shortcuts import render, get_object_or_404
from .forms import RoomForm
from .models import Room, Message, UploadedFile
from django.http import HttpResponseRedirect, JsonResponse
from django.db.models import Q
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.urls import reverse
from django.contrib.auth import get_user_model
from .serializers import RoomSerializer, MessageSerializer
from account.forms import RegistrationForm
import requests

# Create your views here.
User = get_user_model()


def index(request):
    from django.db import connection
    connection.set_tenant(request.user.tenant)
    room_form = RoomForm(request.POST or None)
    if room_form.is_valid():
        room = room_form.save(commit=False)
        room.save()
        return HttpResponseRedirect(reverse('client_chat_page', args=[room.id]))

    context = {
        'room_form': room_form
    }
    return render(request, 'index.html', context=context)

def join_chat(request, room_id):
    """
    This function lets the support group admin join the chat when he/she clicks the room and redirect him/her to that
    particular room
    """
    room = get_object_or_404(Room, id=room_id)
    if request.user.is_authenticated:
        user = User.objects.get(email=request.user.email)
        room.agents.add(user)
        message = Message()
        name = request.user.first_name or request.user.username
        message.message = '%s has joined the chat' % name
        room.messages.add(message, bulk=False)
    return HttpResponseRedirect(reverse('chatting:chat_page', args=[room.id]))


def end_chat(request, room_id):
    """
    This function lets anyone end the chat and set the ended field in the database model to current time.
    """
    room = get_object_or_404(Room, id=room_id)
    message = Message()
    name = request.user.first_name or request.user.username
    message.message = '%s has left the chat.  This chat has ended.' % name
    room.messages.add(message, bulk=False)
    room.end()
    room.save()
    return HttpResponseRedirect(reverse('chatting:admin_index'))


def chat_page(request, room_id):
    """
    Renders the chat page where users can chat.
    """
    room = Room.objects.get(id=room_id)
    if room.ended:
        return HttpResponseRedirect(reverse("chatting:admin_index"))
    messages = Message.objects.filter(room=room).order_by('sent')
    context = {
        'messages': messages,
        'room': room
    }
    return render(request, 'chat_page.html', context)


# ADMIN

from django.forms.models import model_to_dict
import json

class Chatlist(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        all_chats = Room.objects.filter(agents=user).order_by('-last_sent_time')
        pending_rooms = Room.objects.filter(ended=None, agents=None).exclude(agents=user).order_by('-started')
        all_room_serializers = RoomSerializer(all_chats, many=True)
        pending_serializers = RoomSerializer(pending_rooms, many=True)
        return Response({
            'all_rooms': all_room_serializers.data,
            'pending_rooms': pending_serializers.data
        })



def admin_index(request):
    """
    This function lists all the chats and the pending chat of the logged in chat support user, and if the logged in user
    the superuser of the tenant, then make him capable of registering new users to his tenant.
    """
    user = request.user
    all_chats = Room.objects.filter(agents=user)
    pending_rooms = Room.objects.filter(ended=None, agents=None).exclude(agents=user).order_by('-started')

    context = {
        'pending_rooms': pending_rooms,
        'all_chats': all_chats,
        'tenant_name': request.tenant.schema_name

    }
    # Let superuser create new users in his tenant and save the newly created user's info in both public schema and the
    # specific tenant schema

    if request.user.is_superuser:
        if request.POST:
            form = RegistrationForm(request.POST)
            if form.is_valid():
                instance = form.save(commit=False)
                instance.save()
                from django_tenants.utils import schema_context
                with schema_context('public'):
                    form = RegistrationForm(request.POST)
                    instance = form.save(commit=False)
                    instance.save()

            else:
                context['registration_form'] = form
        else:
            form = RegistrationForm(initial={
                'tenant': request.tenant,
            })
            context['registration_form'] = form

    return render(request, 'admin_index.html', context)


"""
The following function performs tasks that are self explanatory 
"""


class GetLastMessages(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        chatId = request.GET.get('chat_id')
        room = get_object_or_404(Room, id=chatId)
        room_agent_exists = False
        room_agent_id = None
        if room.agents:
            room_agent_exists = True
            room_agent_id = room.agents.id
        messages = Message.objects.filter(room=room)
        last_10_messages = messages.order_by('-sent').all()[:50]
        serializers = MessageSerializer(last_10_messages, many=True)
        total_unread_messages = room.unread_messages()
        return Response({
            'room_name': room.name,
            'room_id': room.id,
            'last_10_messages': serializers.data,
            'room_agent_exists': room_agent_exists,
            'room_agent': room_agent_id,
            'total_unread_messages': total_unread_messages
        })


class JoinChat(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        chatId = request.data.get('room_id')
        room = get_object_or_404(Room, id=chatId)
        room.agents = request.user
        # message = Message.objects.create(
        #     room=room,
        #     message=f'{request.user.first_name} has joined the chat',
        #     type='info')
        room.save(updateChatList=False)
        # message.save()
        return Response({
            'chatId': room.id,
            'agentName': room.agents.username,
            'agent': room.agents.id,
            'success': 'Agent added',
        })


def get_user_contact(username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = None
    return user

def get_current_chat(chatId):
    return get_object_or_404(Room, id=chatId)


def get_room(room_id):
    return Room.objects.get(id=room_id)


def get_file_by_id(file_id):
    return UploadedFile.objects.get(id=file_id)
