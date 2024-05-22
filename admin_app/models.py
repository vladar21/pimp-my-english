from django.db import models


class Admin(models.Model):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[('admin', 'Admin')])
