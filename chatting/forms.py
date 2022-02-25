from django import forms
from django.utils.translation import ugettext_lazy as _
from chatting.models import Room, Message


class RoomForm(forms.ModelForm):
    details = forms.CharField(widget=forms.Textarea, label=_('Question'))

    class Meta:
        model = Room
        fields = ('name', 'support_group', 'details')


class MessageForm(forms.ModelForm):
    message = forms.CharField()

    class Meta:
        model = Message
        fields = ('message',)
