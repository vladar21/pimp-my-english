# subscriptions/apps.py

from django.apps import AppConfig


class SubscriptionsConfig(AppConfig):
    """
    Configuration for the Subscriptions app.

    This class sets the default auto field to 'django.db.models.BigAutoField'
    and defines the name of the application as 'subscriptions'.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'subscriptions'
