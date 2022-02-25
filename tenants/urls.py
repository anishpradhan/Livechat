from django.contrib import admin
from django.urls import path
from . import views
from . import api

app_name = 'tenants'

urlpatterns = [
    path('create-tenant/', views.create_tenant, name='create_tenant'),
    path('register_tenant/', views.RegisterTenantView.as_view(), name='register_tenant'),

    path('api/get_tenant_uuid/', api.GetTokenUUID.as_view(), name='get-tenant-uuid'),

]
