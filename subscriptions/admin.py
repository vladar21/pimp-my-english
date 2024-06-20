from django.contrib import admin
from .models import Subscription


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'is_active', 'subscription_period', 'created_at', 'updated_at', 'stripe_subscription_id')
    list_filter = ('is_active', 'subscription_period', 'name')
    search_fields = ('user__email', 'name', 'stripe_subscription_id')


admin.site.register(Subscription, SubscriptionAdmin)
