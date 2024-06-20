# subscriptions/views.py

from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import stripe
from .models import Subscription

stripe.api_key = settings.STRIPE_SECRET_KEY


@login_required
def create_subscription(request):
    if request.method == 'POST':
        token = request.POST.get('stripeToken')
        if not token:
            return render(request, 'subscription_error.html', {'error': 'Stripe token is missing'})

        try:
            customer = stripe.Customer.create(
                email=request.user.email,
                source=token
            )
            print('stripe price id')
            print(settings.STRIPE_PRICE_ID)
            subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{'price': settings.STRIPE_PRICE_ID}],
            )
            Subscription.objects.create(
                user=request.user,
                stripe_subscription_id=subscription.id,
                is_active=True
            )
            return redirect('subscription_success')
        except stripe.error.StripeError as e:
            return render(request, 'subscription_error.html', {'error': str(e)})
    else:
        return render(request, 'create_subscription.html', {'stripe_public_key': settings.STRIPE_PUBLIC_KEY})


@login_required
def manage_subscription(request):
    subscription = Subscription.objects.filter(user=request.user).first()
    if not subscription:
        return redirect('create_subscription')

    if request.method == 'POST':
        try:
            # Cancel subscription
            stripe.Subscription.delete(subscription.stripe_subscription_id)
            subscription.deactivate()
            return redirect('subscription_canceled')
        except stripe.error.StripeError as e:
            return render(request, 'subscription_error.html', {'error': str(e)})

    return render(request, 'manage_subscription.html', {'subscription': subscription})


@login_required
def subscription_success(request):
    return render(request, 'subscription_success.html')


@login_required
def subscription_canceled(request):
    return render(request, 'subscription_canceled.html')
