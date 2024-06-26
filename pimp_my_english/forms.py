# pimp_my_english/forms.py

from django import forms


class ContactForm(forms.Form):
    name = forms.CharField(
        label="Name",
        max_length=100,
        widget=forms.TextInput(attrs={'class': 'feedback-input'})
    )
    email = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(attrs={'class': 'feedback-input'})
    )
    message = forms.CharField(
        label="Message",
        widget=forms.Textarea(attrs={'class': 'feedback-input', 'rows': 3})
    )
    subscribe_to_newsletter = forms.BooleanField(
        label="Subscribe to newsletter",
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'feedback-check'})
    )
