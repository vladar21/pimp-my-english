# admin_app/models.py

from django.db import models


class AdminRoles(models.TextChoices):
    """
    Defines the roles available for Admin users.

    Attributes:
        ADMIN (str): The admin role identifier.
    """
    ADMIN = 'admin', 'Admin'


class Admin(models.Model):
    """
    Model representing an Admin user.

    Attributes:
        user (ForeignKey): A one-to-one relationship with the User model.
        role (CharField): The role of the admin user, chosen from AdminRoles.
    """
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=AdminRoles.choices)

    class Meta:
        """
        Meta class for the Admin model.
        
        Attributes:
            verbose_name (str): The singular name for the Admin model.
            verbose_name_plural (str): The plural name for the Admin model.
        """
        verbose_name = "Admin"
        verbose_name_plural = "Admins"
