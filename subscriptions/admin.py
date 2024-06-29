from django.contrib import admin
from .models import Subscription


class SubscriptionAdmin(admin.ModelAdmin):
    """
    Admin interface options for the Subscription model.

    list_display: Fields to display in the admin list view.
    list_filter: Filters available in the right sidebar to filter the list view.
    search_fields: Fields that can be searched using the search bar.
    """

    list_display = ('user', 'name', 'is_active', 'subscription_period', 'created_at', 'updated_at', 'stripe_subscription_id')
    list_filter = ('is_active', 'subscription_period', 'name')
    search_fields = ('user__email', 'name', 'stripe_subscription_id')


admin.site.register(Subscription, SubscriptionAdmin)
