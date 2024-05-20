from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email_verified = models.BooleanField(default=False)
    is_subscriber = models.BooleanField(default=False)
    subscription = models.ForeignKey('subscriptions.Subscription', on_delete=models.SET_NULL, null=True, blank=True)
