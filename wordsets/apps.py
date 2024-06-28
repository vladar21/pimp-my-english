# wordsets/apps.py

from django.apps import AppConfig


class WordsetsConfig(AppConfig):
    """
    Configuration for the Wordsets app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'wordsets'
