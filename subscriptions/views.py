# subscriptions/views.py

from django.conf import settings
from django.shortcuts import render, redirect
from django.views import View
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import stripe
import logging
from .models import Subscription

stripe.api_key = settings.STRIPE_SECRET_KEY

# Set up logging
logger = logging.getLogger(__name__)


class CreateSubscriptionView(View):
    def get(self, request):
        products = stripe.Product.list(active=True)
        prices = stripe.Price.list(active=True)

        subscription_options = []
        for price in prices:
            if price.recurring:
                product = next((prod for prod in products.data if prod.id == price.product and prod.active), None)
                if product:
                    subscription_options.append({
                        'id': price.id,
                        'name': product.name,
                        'price': price.unit_amount / 100,
                        'currency': price.currency.upper(),
                        'interval': price.recurring['interval']
                    })

        context = {
            'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
            'subscription_options': subscription_options
        }
        return render(request, 'create_subscription.html', context)

    def post(self, request):
        selected_price_id = request.POST.get('subscription_period')
        stripe_token = request.POST.get('stripeToken')

        try:
            customer = stripe.Customer.create(
                email=request.user.email,
                source=stripe_token
            )

            subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{'price': selected_price_id}],
                expand=['latest_invoice.payment_intent', 'plan.product']
            )

            product_name = subscription['plan']['product']['name']

            Subscription.objects.create(
                user=request.user,
                stripe_subscription_id=subscription.id,
                is_active=subscription.status == 'active',
                subscription_period=subscription.plan['interval'],
                name=product_name
            )

            messages.success(request, 'Subscription created successfully.')
            return redirect('accounts:profile')

        except stripe.error.CardError as e:
            messages.error(request, 'There was a problem with your card: ' + e.user_message)
            return redirect('create_subscription')

        except stripe.error.RateLimitError:
            messages.error(request, 'Too many requests made to the API too quickly. Please try again later.')
            return redirect('create_subscription')

        except stripe.error.InvalidRequestError:
            messages.error(request, 'Invalid parameters were supplied to Stripe\'s API.')
            return redirect('create_subscription')

        except stripe.error.AuthenticationError:
            messages.error(request, 'Authentication with Stripe\'s API failed. Please contact support.')
            return redirect('create_subscription')

        except stripe.error.APIConnectionError:
            messages.error(request, 'Network communication with Stripe failed. Please try again later.')
            return redirect('create_subscription')

        except stripe.error.StripeError:
            messages.error(request, 'An error occurred. Please try again or contact support.')
            return redirect('create_subscription')

        except Exception as e:
            messages.error(request, f"An error occurred: {str(e)}")
            return redirect('create_subscription')


create_subscription = CreateSubscriptionView.as_view()


@login_required
def manage_subscription(request):
    subscription = Subscription.objects.filter(user=request.user, is_active=True).first()
    if not subscription:
        return redirect('create_subscription')

    if request.method == 'POST':
        try:
            stripe.Subscription.delete(subscription.stripe_subscription_id)
            subscription.deactivate()
            messages.success(request, 'Subscription canceled successfully.')
            return redirect('subscription_canceled')
        except stripe.error.StripeError as e:
            messages.error(request, f"An error occurred while canceling your subscription: {e.user_message}")
            return render(request, 'subscription_error.html', {'error': str(e)})

    return render(request, 'manage_subscription.html', {'subscription': subscription})


@login_required
def subscription_success(request):
    return render(request, 'subscription_success.html')


@login_required
def subscription_canceled(request):
    return render(request, 'subscription_canceled.html')
