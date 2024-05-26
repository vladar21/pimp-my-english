# quizzes/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from wordsets.models import Word
from .serializers import WordSerializer
import random
from rest_framework.decorators import api_view
from .models import Quiz, QuizResult

class QuizDataView(APIView):
    def get(self, request, format=None):
        word_count = int(request.query_params.get('word_count', 10))
        words = Word.objects.all()
        
        # If requested word count exceeds available words, return all words
        if word_count > len(words):
            word_count = len(words)

        selected_words = random.sample(list(words), word_count)
        serializer = WordSerializer(selected_words, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def submit_quiz_result(request):
    user = request.user
    quiz_id = request.data.get('quiz_id')
    score = request.data.get('score')

    try:
        quiz = Quiz.objects.get(id=quiz_id, user=user)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

    quiz_result = QuizResult(user=user, quiz=quiz, score=score)
    quiz_result.save()

    return Response({"message": "Quiz result submitted successfully."}, status=status.HTTP_201_CREATED)
