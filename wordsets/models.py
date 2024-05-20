from django.db import models


class WordSet(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    rating = models.FloatField(default=0)
    approved_by = models.ForeignKey('admin.Admin', on_delete=models.SET_NULL, null=True, blank=True)
    author_username = models.CharField(max_length=255)
    author_email = models.EmailField()


class WordGroup(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Word(models.Model):
    text = models.CharField(max_length=255)
    language_code = models.CharField(max_length=2, choices=[('en', 'English'), ('ru', 'Russian'), ('ua', 'Ukrainian')])
    country_code = models.CharField(max_length=2, choices=[('US', 'United States'), ('RU', 'Russia'), ('UA', 'Ukraine')])
    word_type = models.CharField(max_length=20, choices=[
        ('noun', 'Noun'), ('verb', 'Verb'), ('adjective', 'Adjective'),
        ('adverb', 'Adverb'), ('pronoun', 'Pronoun'), ('preposition', 'Preposition'),
        ('conjunction', 'Conjunction'), ('interjection', 'Interjection')
    ])
    cefr_level = models.CharField(max_length=2, choices=[('A1', 'A1'), ('A2', 'A2'), ('B1', 'B1'), ('B2', 'B2'), ('C1', 'C1'), ('C2', 'C2')])
    word_group = models.ForeignKey(WordGroup, on_delete=models.CASCADE)
    audio_data = models.BinaryField(null=True, blank=True)
    image_data = models.BinaryField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class WordInSet(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    word_set = models.ForeignKey(WordSet, on_delete=models.CASCADE)


class Definition(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    definition = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
