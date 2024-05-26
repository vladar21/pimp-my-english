# quizzes/urls.py

from django.urls import path
from .views import QuizDataView, submit_quiz_result

urlpatterns = [
    path('api/quiz-data/', QuizDataView.as_view(), name='quiz-data'),
    path('api/submit-quiz-result/', submit_quiz_result, name='submit-quiz-result'),
]
