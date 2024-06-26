# wordsets/views.py

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import WordSet, Word
import json


@csrf_exempt
@login_required
def create_or_update_word_set(request, word_set_id=None):
    """
    Create or update a WordSet.

    If word_set_id is provided, update the existing WordSet with the given ID. Otherwise, create a new WordSet.
    The request must be a POST request containing JSON data with 'title', 'description', and 'words'.
    Ensures that the set of words is unique among all WordSets. Returns a JSON response with success status and message.

    Args:
        request: The HTTP request object.
        word_set_id: The ID of the WordSet to update, or None to create a new WordSet.

    Returns:
        JsonResponse: A JSON response with success status and message.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            description = data.get('description')
            words = data.get('words', [])

            if word_set_id:
                word_set = get_object_or_404(WordSet, id=word_set_id)
            else:
                word_set = WordSet()

            # Check for unique set of words
            existing_word_sets = WordSet.objects.all()
            for existing_word_set in existing_word_sets:
                if existing_word_set != word_set:
                    existing_words = set(existing_word_set.words.values_list('text', flat=True))
                    if existing_words == set(words):
                        return JsonResponse({'success': False, 'message': 'WordSet with this set of words already exists.'}, status=400)

            if not title:
                return JsonResponse({'success': False, 'message': 'Title is required.'}, status=400)

            if not description:
                return JsonResponse({'success': False, 'message': 'Description is required.'}, status=400)

            if not word_set_id and WordSet.objects.filter(name=title).exists():
                return JsonResponse({'success': False, 'message': 'WordSet with this title already exists.'}, status=400)

            word_set.name = title
            word_set.description = description
            word_set.created_by = request.user
            word_set.rating = word_set.rating or 0
            word_set.author_username = request.user.username
            word_set.author_email = request.user.email
            word_set.save()

            words_to_add = Word.objects.filter(text__in=words)
            word_set.words.set(words_to_add)

            response_data = {
                'success': True,
                'message': 'WordSet created successfully.' if not word_set_id else 'WordSet updated successfully.',
                'word_set_id': word_set.id,
                'description': word_set.description,
            }

            return JsonResponse(response_data)

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)


def get_word_set_words(request, word_set_id):
    """
    Get words for a specific WordSet.

    If word_set_id is 0, returns all words in the database. Otherwise, returns words belonging to the specified WordSet.

    Args:
        request: The HTTP request object.
        word_set_id: The ID of the WordSet.

    Returns:
        JsonResponse: A JSON response containing the list of words.
    """
    if word_set_id == 0:
        words = Word.objects.values_list('text', flat=True)
    else:
        word_set = get_object_or_404(WordSet, id=word_set_id)
        words = word_set.words.values_list('text', flat=True)

    response_data = {
        'words': list(words),
    }

    return JsonResponse(response_data)


def list_word_sets(request):
    """
    List all WordSets.

    Returns a JSON response with a list of all WordSets, including their IDs, names, and descriptions.

    Args:
        request: The HTTP request object.

    Returns:
        JsonResponse: A JSON response containing a list of all WordSets.
    """
    word_sets = WordSet.objects.all()
    data = [{"id": ws.id, "name": ws.name, "description": ws.description} for ws in word_sets]
    return JsonResponse({"success": True, "word_sets": data})


@csrf_exempt
@login_required
def delete_word_set(request, word_set_id):
    """
    Delete a WordSet.

    Deletes the WordSet with the given ID. The request must be a POST request.

    Args:
        request: The HTTP request object.
        word_set_id: The ID of the WordSet to delete.

    Returns:
        JsonResponse: A JSON response with success status and message.
    """
    if request.method == 'POST':
        try:
            word_set = get_object_or_404(WordSet, id=word_set_id)
            word_set.delete()
            return JsonResponse({'success': True, 'message': 'WordSet deleted successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)
