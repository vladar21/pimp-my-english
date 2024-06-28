# wordsets/forms.py

from django import forms
from .models import WordSet


class WordSetForm(forms.ModelForm):
    """
    A form for creating and updating WordSet instances.
    """
    class Meta:
        model = WordSet
        fields = ['name', 'description']
