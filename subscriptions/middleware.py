# subscriptions/middleware.py
from django.shortcuts import redirect
from .models import Subscription


class SubscriptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            subscription = Subscription.objects.filter(user=request.user, is_active=True).first()
            if not subscription and request.path.startswith('/settings/'):
                return redirect('create_subscription')
        response = self.get_response(request)
        return response
