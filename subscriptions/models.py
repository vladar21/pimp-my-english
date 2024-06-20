# subscriptions/models.py
from django.conf import settings
from django.db import models


class Subscription(models.Model):
    PIMP_MY_ENGLISH_MONTHLY = 'PimpMyEnglishMonthly'
    PIMP_MY_ENGLISH_YEARLY = 'PimpMyEnglishYearly'
    NAME_CHOICES = [
        (PIMP_MY_ENGLISH_MONTHLY, 'PimpMyEnglishMonthly'),
        (PIMP_MY_ENGLISH_YEARLY, 'PimpMyEnglishYearly'),
    ]
    
    SUBSCRIPTION_PERIOD_CHOICES = [
        ('Monthly', 'Monthly'),
        ('Yearly', 'Yearly')
    ]
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscription')
    stripe_subscription_id = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    subscription_period = models.CharField(max_length=10, choices=SUBSCRIPTION_PERIOD_CHOICES, default='Monthly')
    name = models.CharField(max_length=50, choices=NAME_CHOICES, default=PIMP_MY_ENGLISH_MONTHLY)

    def __str__(self):
        return self.user.username

    def activate(self):
        self.is_active = True
        self.save()

    def deactivate(self):
        self.is_active = False
        self.save()


class Payment(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    stripe_payment_id = models.CharField(max_length=255, default='default_stripe_payment_id')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Payment {self.stripe_payment_id} for subscription {self.subscription}'
