# quizzes/models.py

from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Quiz(models.Model):
    """
    Represents a quiz taken by a user.

    Attributes:
        user (ForeignKey): Reference to the user who took the quiz.
        word_set (ForeignKey): Reference to the word set used in the quiz.
        score (IntegerField): The score achieved by the user in the quiz.
        completed_at (DateTimeField): The date and time when the quiz was completed.

    Meta:
        verbose_name (str): The human-readable name of the model.
        verbose_name_plural (str): The human-readable plural name of the model.
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    word_set = models.ForeignKey('wordsets.WordSet', on_delete=models.CASCADE)
    score = models.IntegerField()
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"


class QuizResult(models.Model):
    """
    Represents the result of a quiz taken by a user.

    Attributes:
        user (ForeignKey): Reference to the user who took the quiz.
        quiz (ForeignKey): Reference to the quiz.
        score (IntegerField): The score achieved by the user in the quiz.
        completed_at (DateTimeField): The date and time when the quiz was completed.

    Meta:
        verbose_name (str): The human-readable name of the model.
        verbose_name_plural (str): The human-readable plural name of the model.
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField()
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Quiz Result"
        verbose_name_plural = "Quiz Results"


class QuizSettings(models.Model):
    """
    Represents the settings for a quiz.

    Attributes:
        word_count (IntegerField): The number of words to be used in the quiz.
        cefr_levels (ArrayField): The CEFR levels of words to be included in the quiz.
        word_types (ArrayField): The types of words to be included in the quiz.
    """
    word_count = models.IntegerField(default=10)
    cefr_levels = ArrayField(models.CharField(max_length=2), default=list)
    word_types = ArrayField(models.CharField(max_length=15), default=list)
