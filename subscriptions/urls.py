# subscriptions/urls.py
from django.urls import path
from . import views, webhooks

urlpatterns = [
    path('create/', views.create_subscription, name='create_subscription'),
    path('manage/', views.manage_subscription, name='manage_subscription'),
    path('success/', views.subscription_success, name='subscription_success'),
    path('canceled/', views.subscription_canceled, name='subscription_canceled'),
    path('webhook/', webhooks.stripe_webhook, name='stripe_webhook'),
]
