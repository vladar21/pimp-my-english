# pimp_my_english/urls.py

from django.contrib import admin
from django.urls import path, include
from .views import landing
from .views import PrivacyPolicyView, TermsAndConditionsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landing, name='landing'),
    path('quizzes/', include('quizzes.urls')),
    path('wordsets/', include('wordsets.urls')),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('accounts/', include('allauth.urls')),
    path('subscriptions/', include('subscriptions.urls')),
    path('privacy-policy/', PrivacyPolicyView.as_view(), name='privacy_policy'),
    path('terms-and-conditions/', TermsAndConditionsView.as_view(), name='terms_and_conditions'),
]
