# wordsets/utils.py

from django.db.models import Max
from .models import WordSet


def calculate_ratings():
    """
    Calculate and update ratings for all WordSets.

    The rating is determined based on the start_count of each WordSet relative to the maximum start_count among all WordSets.
    A rating of 5 is assigned if start_count is at least 80% of the max_start_count.
    A rating of 4 is assigned if start_count is at least 60% of the max_start_count.
    A rating of 3 is assigned if start_count is at least 40% of the max_start_count.
    A rating of 2 is assigned if start_count is at least 20% of the max_start_count.
    A rating of 1 is assigned otherwise.

    Returns:
        None
    """
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
    """
    Find a WordSet by its words.

    Compares the given set of word_texts with the words in each WordSet. Returns the first matching WordSet.

    Args:
        word_texts (list): A list of word texts to match against WordSets.

    Returns:
        WordSet or None: The first matching WordSet, or None if no match is found.
    """
    word_sets = WordSet.objects.all()
    for word_set in word_sets:
        set_words = set(word_set.words.values_list('text', flat=True))
        if set(word_texts) == set_words:
            return word_set
    return None
