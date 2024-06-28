# subscriptions/webhooks.py

from django.views import View
from django.http import JsonResponse
from django.conf import settings
import stripe
from .models import Subscription 

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeWebhookView(View):
    """
    View to handle Stripe webhooks for subscription events.
    """

    def post(self, request):
        """
        Handle the incoming POST request from Stripe webhook.

        This method verifies the Stripe event signature and processes the event
        for 'customer.subscription.deleted' to deactivate the corresponding subscription.

        Args:
            request (HttpRequest): The incoming HTTP request.

        Returns:
            JsonResponse: A JSON response indicating success or error status.
        """
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        endpoint_secret = settings.STRIPE_ENDPOINT_SECRET

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except ValueError as e:
            return JsonResponse({'status': 'error', 'message': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError as e:
            return JsonResponse({'status': 'error', 'message': 'Invalid signature'}, status=400)

        if event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            stripe_subscription_id = subscription['id']

            try:
                user_subscription = Subscription.objects.get(stripe_subscription_id=stripe_subscription_id)
                user_subscription.is_active = False
                user_subscription.save()
            except Subscription.DoesNotExist:
                pass

        return JsonResponse({'status': 'success'})


stripe_webhook = StripeWebhookView.as_view()
