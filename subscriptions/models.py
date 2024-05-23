# subscriptions/models.py
from django.conf import settings
from django.db import models


class SubscriptionDurations(models.TextChoices):
    MONTHLY = 'monthly', 'Monthly'
    YEARLY = 'yearly', 'Yearly'


class Subscription(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    duration = models.CharField(max_length=10, choices=SubscriptionDurations.choices)

    class Meta:
        verbose_name = "Subscription"
        verbose_name_plural = "Subscriptions"


class Payment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    amount = models.FloatField()
    payment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
