from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.users, name='users'),
    path('wordsets/', views.wordsets, name='wordsets'),
    path('quizzes/', views.quizzes, name='quizzes'),
    path('subscriptions/', views.subscriptions, name='subscriptions'),
    path('reports/', views.reports, name='reports'),
]
