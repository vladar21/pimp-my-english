# subscriptions/decorators.py

from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from functools import wraps
from .models import Subscription


def subscription_required(view_func):
    """
    Decorator for views that checks that the user has an active subscription.

    This decorator ensures that the user is logged in and has an active subscription.
    If the user is not logged in, they will be redirected to the login page.
    If the user does not have an active subscription, they will be redirected to the 
    subscription creation page.

    Args:
        view_func (function): The view function to be decorated.

    Returns:
        function: The wrapped view function with subscription checking.
    """
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        """
        Wrapped view function that checks for an active subscription.

        Args:
            request (HttpRequest): The incoming HTTP request.
            *args: Additional positional arguments passed to the view.
            **kwargs: Additional keyword arguments passed to the view.

        Returns:
            HttpResponse: The response from the view function if the user has an active subscription.
            HttpResponseRedirect: Redirects to the subscription creation page if no active subscription.
        """
        subscription = Subscription.objects.filter(user=request.user, is_active=True).first()
        if not subscription:
            return redirect('create_subscription')
        return view_func(request, *args, **kwargs)
    return _wrapped_view
