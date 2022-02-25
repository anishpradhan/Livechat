from django.conf import settings
from django.db import connection
from django.http import Http404
from django.urls import set_urlconf
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model

from django_tenants.utils import remove_www, get_public_schema_name, get_tenant_types, \
    has_multi_type_tenants, get_tenant_domain_model, get_public_schema_urlconf, get_tenant_model


class CustomTenantMiddleware(MiddlewareMixin):
    TENANT_NOT_FOUND_EXCEPTION = Http404
    """
    This middleware should be placed at the very top of the middleware stack.
    Selects the proper database schema using the request host. Can fail in
    various ways which is better than corrupting or revealing data.
    """

    @staticmethod
    def hostname_from_request(request):
        """ Extracts hostname from request. Used for custom requests filtering.
            By default removes the request's port and common prefixes.
        """
        return remove_www(request.get_host().split(':')[0])

    @staticmethod
    def tenant_id_from_request(request):
        """ Extracts hostname from request. Used for custom requests filtering.
            By default removes the request's port and common prefixes.
        """

        if 'HTTP_X_DTS_SCHEMA' in request.META:
            tenant_uuid = request.META.get('HTTP_X_DTS_SCHEMA')

            return tenant_uuid
        try:
            if 'tenant_uuid' in request.session.keys():
                tenant_uuid = request.session['tenant_uuid']
            else:
                tenant_uuid = None

        except AssertionError as err:
            print(err)
            tenant_uuid = None

        return tenant_uuid

    def get_tenant(self, domain_model, tenant_uuid):

        tenant_model = get_tenant_model()
        try:
            tenant = tenant_model.objects.get(tenant_uuid=tenant_uuid)
            return tenant
        except get_tenant_model().DoesNotExist:
            tenant = tenant_model.objects.get(schema_name='public')
            return tenant


    def process_request(self, request):
        # Connection needs first to be at the public schema, as this is where
        # the tenant metadata is stored.
        connection.set_schema_to_public()
        hostname = self.hostname_from_request(request)
        print(request.user)
        tenant_uuid = self.tenant_id_from_request(request)
        domain_model = get_tenant_domain_model()
        try:
            tenant = self.get_tenant(domain_model, tenant_uuid)
        except domain_model.DoesNotExist:
            self.no_tenant_found(request, tenant_uuid)
            return

        tenant.domain_url = hostname
        request.tenant = tenant
        connection.set_tenant(request.tenant)
        try:
            User = get_user_model()
            user = User.objects.get(email=request.user.email)
            request.user = user
        except:
            pass
        self.setup_url_routing(request)

    def no_tenant_found(self, request, hostname):
        """ What should happen if no tenant is found.
        This makes it easier if you want to override the default behavior """
        if hasattr(settings, 'SHOW_PUBLIC_IF_NO_TENANT_FOUND') and settings.SHOW_PUBLIC_IF_NO_TENANT_FOUND:
            self.setup_url_routing(request=request, force_public=True)
        else:
            raise self.TENANT_NOT_FOUND_EXCEPTION('No tenant for hostname "%s"' % hostname)

    @staticmethod
    def setup_url_routing(request, force_public=False):
        """
        Sets the correct url conf based on the tenant
        :param request:
        :param force_public
        """
        public_schema_name = get_public_schema_name()
        if has_multi_type_tenants():
            tenant_types = get_tenant_types()
            if (not hasattr(request, 'tenant') or
                    ((force_public or request.tenant.schema_name == get_public_schema_name()) and
                     'URLCONF' in tenant_types[public_schema_name])):
                request.urlconf = get_public_schema_urlconf()
            else:
                tenant_type = request.tenant.get_tenant_type()
                request.urlconf = tenant_types[tenant_type]['URLCONF']
            set_urlconf(request.urlconf)

        else:
            # Do we have a public-specific urlconf?
            if (hasattr(settings, 'PUBLIC_SCHEMA_URLCONF') and
                    (force_public or request.tenant.schema_name == get_public_schema_name())):
                request.urlconf = settings.PUBLIC_SCHEMA_URLCONF