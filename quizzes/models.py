# quizzes/models.py

from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Quiz(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    word_set = models.ForeignKey('wordsets.WordSet', on_delete=models.CASCADE)
    score = models.IntegerField()
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"


class QuizResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField()
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Quiz Result"
        verbose_name_plural = "Quiz Results"


class QuizSettings(models.Model):
    word_count = models.IntegerField(default=10)
    cefr_levels = ArrayField(models.CharField(max_length=2), default=list)
    word_types = ArrayField(models.CharField(max_length=15), default=list)
