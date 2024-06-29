# subscriptions/middleware.py

from django.shortcuts import redirect
from .models import Subscription


class SubscriptionMiddleware:
    """
    Middleware to check if the user has an active subscription when accessing certain URLs.

    If the user is authenticated and does not have an active subscription,
    they will be redirected to the subscription creation page when trying
    to access the '/settings/' URL.

    Attributes:
        get_response (function): The next middleware or view in the chain.
    """
    def __init__(self, get_response):
        """
        Initialize the middleware with the next response handler.

        Args:
            get_response (function): The next middleware or view in the chain.
        """
        self.get_response = get_response

    def __call__(self, request):
        """
        Process the request and check for an active subscription.

        If the user is authenticated and does not have an active subscription,
        they will be redirected to the subscription creation page when trying
        to access the '/settings/' URL.

        Args:
            request (HttpRequest): The incoming HTTP request.

        Returns:
            HttpResponse: The response from the next middleware or view in the chain.
        """
        if request.user.is_authenticated:
            subscription = Subscription.objects.filter(user=request.user, is_active=True).first()
            if not subscription and request.path.startswith('/settings/'):
                return redirect('create_subscription')
        response = self.get_response(request)
        return response
