# quizzes/urls.py

from django.urls import path
from .views import QuizDataView, quiz_settings, update_quiz_settings, landing
from . import views

urlpatterns = [
    path('api/quiz-data/', QuizDataView.as_view(), name='quiz-data'),
    path('rules/', views.rules, name='rules'),
    path('settings/', quiz_settings, name='quiz_settings'),
    path('update_quiz_settings/', update_quiz_settings, name='update_quiz_settings'),
    path('check-media-data/', views.check_media_data, name='check_media_data'),
    path('game/', landing, name='landing'),
]
