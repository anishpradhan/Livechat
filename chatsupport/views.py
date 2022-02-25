from django.shortcuts import render
from tenants.models import Client


def main_index(request):
    tenants = Client.objects.all().exclude(schema_name='public')
    context = {
        'tenants': tenants,
    }
    return render(request, 'main_index.html', context=context)
