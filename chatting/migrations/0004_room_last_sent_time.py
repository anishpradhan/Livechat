# Generated by Django 3.2.5 on 2022-02-19 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatting', '0003_alter_message_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='last_sent_time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
