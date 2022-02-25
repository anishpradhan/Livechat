
from rest_framework.views import APIView
from rest_framework import permissions
from .models import *
from rest_framework.response import Response


class GetTokenUUID(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        schema_name = request.GET.get('schema_name')
        queryset = Client.objects.get(schema_name=schema_name)
        response = {
            'tenant_uuid': str(queryset.tenant_uuid),
            'tenant_name': queryset.schema_name,
        }
        return Response(response)
