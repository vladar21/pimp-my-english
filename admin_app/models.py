# admin_app/models.py

from django.db import models


class AdminRoles(models.TextChoices):
    ADMIN = 'admin', 'Admin'


class Admin(models.Model):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=AdminRoles.choices)

    class Meta:
        verbose_name = "Admin"
        verbose_name_plural = "Admins"
