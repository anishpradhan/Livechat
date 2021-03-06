# Generated by Django 3.2.5 on 2021-07-07 14:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tenants', '0002_client_tenant_uuid'),
        ('account', '0002_account_tenant'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='tenant',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='tenants.client'),
        ),
    ]
