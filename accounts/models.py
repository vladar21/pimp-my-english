# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRoles(models.TextChoices):
    GUEST = 'guest', 'Guest'
    SUBSCRIBER = 'subscriber', 'Subscriber'


class User(AbstractUser):
    is_subscriber = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=UserRoles.choices, default=UserRoles.GUEST)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        swappable = 'AUTH_USER_MODEL'
