# accounts/views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from allauth.account.views import SignupView, LoginView
from subscriptions.models import Subscription
from wordsets.models import WordSet


class CustomSignupView(SignupView):
    template_name = 'account/signup.html'


class CustomLoginView(LoginView):
    template_name = 'account/login.html'


@login_required
def profile_view(request):
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
    if request.method == 'POST':
        logout(request)
        return redirect('account_login')
    return render(request, 'account/logout.html')
