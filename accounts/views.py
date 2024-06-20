# accounts/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from subscriptions.models import Subscription
from wordsets.models import WordSet


@login_required
def profile(request):
    user = request.user
    subscriptions = Subscription.objects.filter(user=user)
    wordsets = WordSet.objects.filter(created_by=user)

    context = {
        'user': user,
        'subscriptions': subscriptions,
        'wordsets': wordsets,
    }

    return render(request, 'profile.html', context)
