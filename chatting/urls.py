from django.urls import path
from . import views
from . import api

app_name = 'chatting'

urlpatterns = [
    path('', views.index, name="index"),
    path('support/', views.admin_index, name="admin_index"),
    path('admin_join_chat/<str:room_id>', views.join_chat, name="admin_join_chat"),
    path('admin_end_chat/<str:room_id>', views.end_chat, name="admin_end_chat"),
    path('support/chat_page/<str:room_id>', views.chat_page, name="chat_page"),
    path('api/create_room/', api.CreateRoomAPI.as_view(), name="create_room"),
    path('api/upload_file/', api.fileUpload, name="upload_file"),
    path('api/download_file/', api.fileDownload, name="download_file"),
    path('api/chatlist/', views.Chatlist.as_view(), name="chatlist"),
    # path('api/latest_room/', views.LatestChatRoom.as_view(), name="latestRoom"),
    path('api/get_messages/', views.GetLastMessages.as_view(), name="getMessages"),
    path('api/join_chat/', views.JoinChat.as_view(), name="joinChat"),



]