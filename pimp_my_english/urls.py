# pimp_my_english/urls.py

from django.contrib import admin
from django.urls import path, include
from .views import landing

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landing, name='landing'),
    path('quizzes/', include('quizzes.urls')),
    path('wordsets/', include('wordsets.urls')),
    path('users/', include('users.urls')),
    path('accounts/', include('allauth.urls')),
    # path('subscriptions/', include('subscriptions.urls')),
]
