# quizzes/urls.py

from django.urls import path
from .views import QuizDataView, submit_quiz_result
from . import views

urlpatterns = [
    path('api/quiz-data/', QuizDataView.as_view(), name='quiz-data'),
    path('api/submit-quiz-result/', submit_quiz_result, name='submit-quiz-result'),

    path('rules/', views.rules, name='rules'),
    path('settings/', views.quiz_settings, name='quiz_settings'),
    path('submit_quiz_settings/', views.submit_quiz_settings, name='submit_quiz_settings'),
]
