# accounts/urls.py

from django.urls import path, include
from .views import profile_view, logout_view, CustomSignupView, CustomLoginView

app_name = 'accounts'

urlpatterns = [
    path('profile/', profile_view, name='profile'),
    path('logout/', logout_view, name='logout'),
    path('', include('allauth.urls')),
]
