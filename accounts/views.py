# accounts/views.py

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from allauth.account.views import SignupView, LoginView
from subscriptions.models import Subscription
from wordsets.models import WordSet


class CustomSignupView(SignupView):
    """
    Custom signup view that renders the signup template.

    Attributes:
        template_name (str): The path to the signup template.
    """
    template_name = 'account/signup.html'


class CustomLoginView(LoginView):
    """
    Custom login view that renders the login template.

    Attributes:
        template_name (str): The path to the login template.
    """
    template_name = 'account/login.html'


@login_required
def profile_view(request):
    """
    View function for displaying the user profile, including their subscriptions and word sets.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The HTTP response with the rendered profile template.
    """
    user = request.user
    subscriptions = Subscription.objects.filter(user=user)
    wordsets = WordSet.objects.filter(created_by=user)
    context = {
        'user': user,
        'subscriptions': subscriptions,
        'wordsets': wordsets,
    }
    return render(request, 'profile.html', context)


def logout_view(request):
    """
    View function for logging out the user.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The HTTP response with the rendered logout template, or redirects to login page after logout.
    """
    if request.method == 'POST':
        logout(request)
        return redirect('account_login')
    return render(request, 'account/logout.html')
