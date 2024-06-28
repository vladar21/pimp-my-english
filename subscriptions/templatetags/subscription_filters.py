# subscriptions/templatetags/subscription_filters.py

from django import template

register = template.Library()


@register.filter
def any_active(subscriptions):
    """
    Custom template filter to check if any subscription in the given queryset is active.

    Args:
        subscriptions (QuerySet): A queryset of Subscription objects.

    Returns:
        bool: True if any subscription in the queryset is active, otherwise False.
    """
    return any(subscription.is_active for subscription in subscriptions)


register.filter('any_active', any_active)
