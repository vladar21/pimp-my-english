# wordsets/utils.py

from django.db.models import Max
from .models import WordSet


def calculate_ratings():
    word_sets = WordSet.objects.all()
    max_start_count = word_sets.aggregate(max_start=Max('start_count'))['max_start'] or 1

    for word_set in word_sets:
        start_count = word_set.start_count
        if start_count >= 0.8 * max_start_count:
            rating = 5
        elif start_count >= 0.6 * max_start_count:
            rating = 4
        elif start_count >= 0.4 * max_start_count:
            rating = 3
        elif start_count >= 0.2 * max_start_count:
            rating = 2
        else:
            rating = 1
        word_set.rating = rating
        word_set.save()


def find_word_set_by_words(word_texts):
    word_sets = WordSet.objects.all()
    for word_set in word_sets:
        set_words = set(word_set.words.values_list('text', flat=True))
        if set(word_texts) == set_words:
            return word_set
    return None
