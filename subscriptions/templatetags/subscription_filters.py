from django import template

register = template.Library()


@register.filter
def any_active(subscriptions):
    return any(subscription.is_active for subscription in subscriptions)


register.filter('any_active', any_active)
