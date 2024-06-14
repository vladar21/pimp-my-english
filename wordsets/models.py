# wordsets/models.py

from django.db import models
from django.conf import settings


class WordType(models.TextChoices):
    NOUN = 'noun', 'Noun'
    VERB = 'verb', 'Verb'
    ADJECTIVE = 'adjective', 'Adjective'
    ADVERB = 'adverb', 'Adverb'
    PRONOUN = 'pronoun', 'Pronoun'
    PREPOSITION = 'preposition', 'Preposition'
    CONJUNCTION = 'conjunction', 'Conjunction'
    INTERJECTION = 'interjection', 'Interjection'


class CefrLevel(models.TextChoices):
    A1 = 'A1', 'A1'
    A2 = 'A2', 'A2'
    B1 = 'B1', 'B1'
    B2 = 'B2', 'B2'
    C1 = 'C1', 'C1'
    C2 = 'C2', 'C2'


class LanguageCode(models.TextChoices):
    EN = 'en', 'English'
    RU = 'ru', 'Russian'
    UA = 'ua', 'Ukrainian'
    # добавить другие коды языков по ISO 639-1


class CountryCode(models.TextChoices):
    US = 'US', 'United States'
    UK = 'UK', 'United Kingdom'
    RU = 'RU', 'Russia'
    UA = 'UA', 'Ukraine'
    # добавить другие коды стран по Alpha-2 ISO 3166-1


class WordSet(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_wordsets')
    rating = models.FloatField()
    approved_by = models.ForeignKey('admin_app.Admin', on_delete=models.SET_NULL, null=True, blank=True)
    author_username = models.CharField(max_length=255)
    author_email = models.EmailField()
    words = models.ManyToManyField('Word', related_name='word_sets')

    class Meta:
        verbose_name = "Word Set"
        verbose_name_plural = "Word Sets"


class Word(models.Model):
    text = models.CharField(max_length=255)
    language_code = models.CharField(max_length=2, choices=LanguageCode.choices)
    country_code = models.CharField(max_length=2, choices=CountryCode.choices)
    word_type = models.CharField(max_length=20, choices=WordType.choices)
    cefr_level = models.CharField(max_length=2, choices=CefrLevel.choices)
    audio_data = models.BinaryField(blank=True, null=True)
    image_data = models.BinaryField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Word"
        verbose_name_plural = "Words"


class Definition(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    definition = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Definition"
        verbose_name_plural = "Definitions"
