# accounts/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib import messages
from django.contrib.auth.decorators import login_required


@login_required
def profile(request):
    return render(request, 'templates/account/profile.html')
