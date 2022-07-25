"""
ASGI config for chatsupport project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatsupport.settings')

"""
Uncomment for local development only in docker or else comment for production in heroku
"""
# from channels.layers import get_channel_layer
# channel_layers = get_channel_layer()
"""
till here.
"""

django.setup()

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from chatting.tokenauthmiddleware import TokenAuthMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
import chatting.routing as routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
        ),

    )
})
