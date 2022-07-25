from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.http import JsonResponse, HttpResponse
from wsgiref.util import FileWrapper
import json
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView


class CreateRoomAPI(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        name = request.POST.get('name')
        details = request.POST.get('question')
        data = {
            'name': name,
            'details': details,
        }
        serializer = RoomSerializer(data=data)

        if serializer.is_valid():
            response = serializer.save()
            response = {
                'chat_id': str(response.id),
                'chat_name': response.name,
            }
            response = json.dumps(response)

            return Response(data=json.loads(response), status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def fileUpload(request):
    if request.method == 'POST':

        file = request.FILES['file']

        if file:
            file_created = UploadedFile.objects.create(uploaded_by=request.POST['uploaded_by'], file=file)
            return JsonResponse(serialize_file_model(file_created))


@api_view(['GET'])
def fileDownload(request):
    if request.method == 'GET':
        file_id = request.GET['file_id']

        queryset = UploadedFile.objects.get(id=file_id)
        file_handle = queryset.file.path
        document = open(file_handle, 'rb')
        response = HttpResponse(FileWrapper(document), content_type='application/text')
        response['Content-Disposition'] = 'attachment; filename="%s"' % queryset.file.name
        return response
