# Create your models here.
# This file defines placeholder models used for multitenancy support

# placeholder model definitions taken from django tenants
# https://django-tenants.readthedocs.io/en/latest/install.html
import uuid
from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Client(TenantMixin):
    tenant_uuid = models.UUIDField(default=uuid.uuid4, null=False, blank=False)
    name = models.CharField(max_length=100)
    created_on = models.DateField(auto_now_add=True)

    # default true, schema will be automatically created and synced when it is saved
    auto_create_schema = True

    def __str__(self):
        return self.name


class Domain(DomainMixin):
    pass

    def __str__(self):
        return self.domain
