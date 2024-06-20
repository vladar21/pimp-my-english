# accounts/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from subscriptions.models import Subscription, Payment
from wordsets.models import WordSet

@login_required
def profile(request):
    user = request.user
    subscription = Subscription.objects.filter(user=user).first()
    wordsets = WordSet.objects.filter(created_by=user)

    context = {
        'user': user,
        'subscription': subscription,
        'wordsets': wordsets,
    }

    return render(request, 'profile.html', context)
