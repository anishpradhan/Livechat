from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from .models import Client, Domain
from account.models import Account
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response


'''
    This function displays the tenant creation form, and on receiving valid form data, creates the tenant along with its 
    domain, on both the public schema and on that particular tenant schema
    
'''


def create_tenant(request):
    if request.method == 'POST':
        schema_name = request.POST['name']
        if schema_name == 'public':
            return HttpResponse('<h1>This name ' + schema_name + ' is not available. Please choose another name</h1>')
        name = request.POST['name'].upper()
        domain = request.POST['domain']
        tenant = Client(schema_name=schema_name,
                        name=name)
        tenant.save()
        set_domain = Domain()
        set_domain.domain = domain
        set_domain.tenant = tenant
        set_domain.is_primary = True
        set_domain.save()

        """
            create admin for that tenant and save info on the public schema so that the user info can be visible on main
            domain i.e. public schema domain as well.
         """

        admin_email = f'admin@{schema_name}.com'
        admin_username = f'admin_{schema_name}'
        admin_firstname = f'{schema_name}'
        admin_lastname = f'admin'
        admin_tenant = tenant
        admin_password = f'admin_{schema_name}'

        create_admin = Account(email=admin_email, username=admin_username, first_name=admin_firstname,
                               last_name=admin_lastname, tenant=admin_tenant, is_admin=True, is_active=True,
                               is_staff=True, is_superuser=True)
        create_admin.set_password(admin_password)
        create_admin.save()

        """
            create admin for the tenant and save info on that tenant schema        
        """
        from django_tenants.utils import schema_context
        saved_id = create_admin.id
        with schema_context(tenant.schema_name):
            create_admin = Account(id=saved_id, email=admin_email, username=admin_username, first_name=admin_firstname,
                                   last_name=admin_lastname, tenant=admin_tenant, is_admin=True, is_active=True,
                                   is_staff=True, is_superuser=True)
            create_admin.set_password(admin_password)
            create_admin.save()

        response = HttpResponseRedirect(reverse('account:login'))
        return response
    return render(request, 'register_tenant.html')


class RegisterTenantView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        schema_name = data['company_name']
        name = schema_name.upper()
        first_name = data['full_name'].split(' ')[0]
        last_name = data['full_name'].split(' ')[1]
        email = data['email']
        password = data['password']
        domain = data['domain']
        phone = data['phone']
        if schema_name == 'public':
            return HttpResponse('<h1>This name ' + schema_name + ' is not available. Please choose another name</h1>')
        try:
            tenant = Client(schema_name=schema_name,
                            name=name)
            tenant.save()
            set_domain = Domain()
            set_domain.domain = domain
            set_domain.tenant = tenant
            set_domain.is_primary = True
            set_domain.save()

            # admin_email = f'admin@{schema_name}.com'
            admin_username = f'admin_{schema_name}'
            # admin_firstname = f'{schema_name}'
            # admin_lastname = f'admin'
            admin_tenant = tenant
            # admin_password = f'admin_{schema_name}'

            create_admin = Account(email=email, username=admin_username, first_name=first_name,
                                   last_name=last_name, tenant=admin_tenant, is_admin=True, is_active=True,
                                   is_staff=True, is_superuser=True)
            create_admin.set_password(password)
            create_admin.save()

            from django_tenants.utils import schema_context
            saved_id = create_admin.id
            with schema_context(tenant.schema_name):
                create_admin = Account(id=saved_id, email=email, username=admin_username, first_name=first_name,
                                       last_name=last_name, tenant=admin_tenant, is_admin=True, is_active=True,
                                       is_staff=True, is_superuser=True)
                create_admin.set_password(password)
                create_admin.save()

            # response = HttpResponseRedirect(reverse('account:login'))
            return Response({
                'success' : 'Account successfully created!'
            })
        except:
            return Response({
                'error' : "Error in creating account"
            })