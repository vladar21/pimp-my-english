# pimp_my_english/views.py

from django.shortcuts import render
from django.views.generic import TemplateView


def landing(request):
    return render(request, 'landing.html')


class PrivacyPolicyView(TemplateView):
    template_name = "privacy_policy.html"


class TermsAndConditionsView(TemplateView):
    template_name = "terms_and_conditions.html"