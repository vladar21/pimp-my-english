# wordsets/forms.py

from django import forms
from .models import WordSet

class WordSetForm(forms.ModelForm):
    class Meta:
        model = WordSet
        fields = ['name', 'description']
