# pimp_my_english/views.py

import json
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.conf import settings
from django.http import JsonResponse
from django.core.mail import send_mail
from django.contrib import messages
from mailchimp3 import MailChimp
from mailchimp3.mailchimpclient import MailChimpError
from .forms import ContactForm


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


def contact_view(request):
    if request.method == 'POST':
        contact_form = ContactForm(request.POST)
        if contact_form.is_valid():
            name = contact_form.cleaned_data['name']
            email = contact_form.cleaned_data['email']
            message = contact_form.cleaned_data['message']
            subscribe = contact_form.cleaned_data['subscribe_to_newsletter']

            # Send email
            send_mail(
                f'PimpMyEnglish feedback from {name}: {email}',
                message,
                email,
                ['gedurvo@gmail.com'],
                fail_silently=False,
            )

            if subscribe:
                try:
                    # Call the subscribe_newsletter function directly
                    client = MailChimp(mc_api=settings.MAILCHIMP_API_KEY, mc_user='gedurvo@gmail.com')
                    client.lists.members.create(settings.MAILCHIMP_EMAIL_LIST_ID, {
                        'email_address': email,
                        'status': 'subscribed',
                    })
                    messages.success(request, 'Your message has been sent successfully and you have been subscribed to the newsletter!')
                except MailChimpError as e:
                    error_response = e.args[0]
                    error_detail = error_response.get('detail', 'An error occurred')
                    messages.error(request, f'Your message was sent but there was an error subscribing to the newsletter: {error_detail}')
                except Exception as e:
                    messages.error(request, f'Your message was sent but there was an error subscribing to the newsletter: {str(e)}')
            else:
                messages.success(request, 'Your message has been sent successfully!')

            return redirect('contact')
    else:
        contact_form = ContactForm()

    return render(request, 'contact.html', {'contact_form': contact_form})
