# subscriptions/decorators.py
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from functools import wraps
from .models import Subscription


def subscription_required(view_func):
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        subscription = Subscription.objects.filter(user=request.user, is_active=True).first()
        if not subscription:
            return redirect('create_subscription')
        return view_func(request, *args, **kwargs)
    return _wrapped_view
