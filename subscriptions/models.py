from django.db import models


class Subscription(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    duration = models.CharField(max_length=20, choices=[('monthly', 'Monthly'), ('yearly', 'Yearly')])


class Payment(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    amount = models.FloatField()
    payment_date = models.DateTimeField(auto_now_add=True)
