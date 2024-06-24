# pimp_my_english/views.py

import json
from django.shortcuts import render
from django.views.generic import TemplateView
from django.conf import settings
from django.http import JsonResponse
from mailchimp3 import MailChimp
from mailchimp3.mailchimpclient import MailChimpError


# def landing(request):
#     return render(request, 'landing.html')


class HomeView(TemplateView):
    template_name = "home.html"


class PrivacyPolicyView(TemplateView):
    template_name = "privacy_policy.html"


class TermsAndConditionsView(TemplateView):
    template_name = "terms_and_conditions.html"


def subscribe_newsletter(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)

        client = MailChimp(mc_api=settings.MAILCHIMP_API_KEY, mc_user='gedurvo@gmail.com')
        try:
            client.lists.members.create(settings.MAILCHIMP_EMAIL_LIST_ID, {
                'email_address': email,
                'status': 'subscribed',
            })
            return JsonResponse({'message': 'Subscription successful'})
        except MailChimpError as e:
            error_response = e.args[0]
            error_detail = error_response.get('detail', 'An error occurred')
            return JsonResponse({'error': error_detail}, status=error_response.get('status', 400))
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)
