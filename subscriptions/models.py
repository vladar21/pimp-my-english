# subscriptions/models.py

from django.conf import settings
from django.db import models


class Subscription(models.Model):
    """
    Model representing a subscription to the Pimp My English service.

    Attributes:
        user (ForeignKey): The user associated with the subscription.
        stripe_subscription_id (CharField): The Stripe ID for the subscription.
        is_active (BooleanField): Indicates whether the subscription is active.
        created_at (DateTimeField): The date and time when the subscription was created.
        updated_at (DateTimeField): The date and time when the subscription was last updated.
        subscription_period (CharField): The period of the subscription (Monthly or Yearly).
        name (CharField): The name of the subscription plan.
    """
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
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    stripe_subscription_id = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    subscription_period = models.CharField(max_length=10, choices=SUBSCRIPTION_PERIOD_CHOICES, default='Monthly')
    name = models.CharField(max_length=50, choices=NAME_CHOICES, default=PIMP_MY_ENGLISH_MONTHLY)

    def __str__(self):
        """
        Return a string representation of the subscription.

        Returns:
            str: The username of the user associated with the subscription.
        """
        return self.user.username

    def activate(self):
        """
        Activate the subscription.
        """
        self.is_active = True
        self.save()

    def deactivate(self):
        """
        Deactivate the subscription.
        """
        self.is_active = False
        self.save()


class Payment(models.Model):
    """
    Model representing a payment for a subscription.

    Attributes:
        subscription (ForeignKey): The subscription associated with the payment.
        stripe_payment_id (CharField): The Stripe ID for the payment.
        amount (DecimalField): The amount of the payment.
        created_at (DateTimeField): The date and time when the payment was created.
    """
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    stripe_payment_id = models.CharField(max_length=255, default='default_stripe_payment_id')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Return a string representation of the payment.

        Returns:
            str: A string indicating the payment ID and the associated subscription.
        """
        return f'Payment {self.stripe_payment_id} for subscription {self.subscription}'
