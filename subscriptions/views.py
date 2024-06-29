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
    """
    View to handle the creation of a new subscription using Stripe.
    """

    def get(self, request):
        """
        Handle GET requests to display the subscription creation form.

        Retrieves active products and prices from Stripe, filters for recurring prices,
        and constructs a context with subscription options to render the form.

        Args:
            request (HttpRequest): The incoming HTTP request.

        Returns:
            HttpResponse: The rendered subscription creation form.
        """
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
        """
        Handle GET requests to display the subscription creation form.

        Retrieves active products and prices from Stripe, filters for recurring prices,
        and constructs a context with subscription options to render the form.

        Args:
            request (HttpRequest): The incoming HTTP request.

        Returns:
            HttpResponse: The rendered subscription creation form.
        """
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
    """
    Handle the management and cancellation of an active subscription.

    Retrieves the user's active subscription, and if a POST request is received,
    attempts to cancel the subscription on Stripe and deactivate it in the database.

    Args:
        request (HttpRequest): The incoming HTTP request.

    Returns:
        HttpResponse: Renders the subscription management page, or redirects to
        the subscription creation form if no active subscription is found.
    """
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
    """
    Render the subscription success page.

    Args:
        request (HttpRequest): The incoming HTTP request.

    Returns:
        HttpResponse: The rendered subscription success page.
    """
    return render(request, 'subscription_success.html')


@login_required
def subscription_canceled(request):
    """
    Render the subscription canceled page.

    Args:
        request (HttpRequest): The incoming HTTP request.

    Returns:
        HttpResponse: The rendered subscription canceled page.
    """
    return render(request, 'subscription_canceled.html')
