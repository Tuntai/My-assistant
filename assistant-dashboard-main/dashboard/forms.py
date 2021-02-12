from django import forms
from .models import post

class HomeForm(forms.Form):
    post = forms.CharField(widget=forms.TextInput())