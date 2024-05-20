from django.db import models


class Quiz(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    word_set = models.ForeignKey('wordsets.WordSet', on_delete=models.CASCADE)
    score = models.IntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)


class QuizResult(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)
