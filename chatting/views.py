from django.shortcuts import render, get_object_or_404
from .forms import RoomForm
from .models import Room, Message, SupportGroup, UploadedFile
from django.http import HttpResponseRedirect, JsonResponse
from django.db.models import Q
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.urls import reverse
from django.contrib.auth import get_user_model
from .serializers import RoomSerializer, MessageSerializer
from account.forms import RegistrationForm

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


class CreateRoom(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        """
        Create room through ajax request from the frontend
        """
        room_name = request.GET.get('room_name', None)
        support_group = request.GET.get('support', None)
        question = request.GET.get('question', None)
        support = SupportGroup.objects.get(name=support_group)
        room = Room(name=room_name, support_group=support, details=question)
        room.save()
        response = {
            'room_name': room.name,
            'room_id': str(room.id),
        }
        return Response(response)


def get_support_groups(request):
    """
        This function returns all the support groups in the particular tenant.
    """
    support_group = SupportGroup.objects.all()
    names = [i.name for i in support_group]
    response = {
        'support_groups': names
    }
    return JsonResponse(response)


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
        # groups = SupportGroup.objects.filter(
        #     Q(supervisors=user) | Q(agents=user)
        # )
        # if groups:
        #     pending_rooms = pending_rooms.filter(support_group__in=groups)

        # pending_rooms = json.dumps(model_to_dict(pending_rooms))
        # all_chats = model_to_dict(all_chats)
        # support_group = model_to_dict(SupportGroup.objects.get(agents=user))
        # schema_name = model_to_dict(request.tenant.schema_name)
        # response = {
        #     'pending_rooms': pending_rooms,
        #     'all_chats': all_chats,
        #     'support_group': support_group,
        #     'tenant_name': schema_name

        # }
        all_room_serializers = RoomSerializer(all_chats, many=True)
        pending_serializers = RoomSerializer(pending_rooms, many=True)

        # pending_rooms = json.dumps(serializers.data)
        return Response({
            'all_rooms': all_room_serializers.data,
            'pending_rooms': pending_serializers.data
        })


class LatestChatRoom(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        pending_rooms = Room.objects.filter(ended=None, agents=None).exclude(agents=user).order_by('-started')

        groups = SupportGroup.objects.filter(
            Q(supervisors=user) | Q(agents=user)
        )
        if groups:
            pending_rooms = pending_rooms.filter(support_group__in=groups)

        pending_room = pending_rooms[:1]
        serializers = RoomSerializer(pending_room, many=True)

        return Response({
            'roomID': serializers.data[0]['id']
        })


def admin_index(request):
    """
    This function lists all the chats and the pending chat of the logged in chat support user, and if the logged in user
    the superuser of the tenant, then make him capable of registering new users to his tenant.
    """
    user = request.user
    all_chats = Room.objects.filter(agents=user)
    pending_rooms = Room.objects.filter(ended=None, agents=None).exclude(agents=user).order_by('-started')

    groups = SupportGroup.objects.filter(
        Q(supervisors=user) | Q(agents=user)
    )
    if groups:
        pending_rooms = pending_rooms.filter(support_group__in=groups)

    context = {
        'pending_rooms': pending_rooms,
        'all_chats': all_chats,
        'support_group': SupportGroup.objects.get(agents=user),
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
        if room.agents.all():
            room_agent_exists = True
        messages = Message.objects.filter(room=room)
        last_10_messages = messages.order_by('-sent').all()[:50]
        serializers = MessageSerializer(last_10_messages, many=True)
        return Response({
            'room_name': room.name,
            'last_10_messages': serializers.data,
            'room_agent_exists': room_agent_exists
        })


class JoinChat(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        chatId = request.data.get('room_id')
        room = get_object_or_404(Room, id=chatId)
        room.agents.add(request.user)
        message = Message.objects.create(
            room=room,
            message=f'{request.user.first_name} has joined the chat',
            type='info')
        message.save()
        # channel_layer = get_channel_layer()
        # message = {
        #     'command': 'chat_joined',
        #     'message': {
        #
        #     }
        # }
        # async_to_sync(channel_layer.group_send)(
        #     'user', {
        #         'type': 'chat_message',
        #         'message': message
        #     }
        # )
        return Response({
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
