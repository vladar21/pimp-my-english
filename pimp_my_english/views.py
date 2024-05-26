# pimp_my_english/views.py

from django.shortcuts import render


def landing(request):
    return render(request, 'landing.html')
