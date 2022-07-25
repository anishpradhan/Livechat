from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/livechat/chatrooms/<str:room_uuid>/', consumers.ChatConsumer.as_asgi()),
    path('ws/livechat/user/', consumers.EventConsumer.as_asgi()),
]

