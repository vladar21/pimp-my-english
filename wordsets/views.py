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
def create_word_set(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            description = data.get('description')
            words = data.get('words', [])

            # Check for unique set of words
            existing_word_sets = WordSet.objects.all()
            for word_set in existing_word_sets:
                existing_words = set(word_set.words.values_list('text', flat=True))
                if existing_words == set(words):
                    return JsonResponse({'success': False, 'message': 'WordSet with this set of words already exists.'}, status=400)

            if not title:
                return JsonResponse({'success': False, 'message': 'Title is required.'}, status=400)
            
            if not description:
                return JsonResponse({'success': False, 'message': 'Description is required.'}, status=400)
            
            if WordSet.objects.filter(name=title).exists():
                return JsonResponse({'success': False, 'message': 'WordSet with this title already exists.'}, status=400)

            word_set = WordSet.objects.create(
                name=title,
                description=description,
                created_by=request.user,
                rating=0,  # Initialize with 0 or any default value
                author_username=request.user.username,
                author_email=request.user.email
            )

            words_to_add = Word.objects.filter(text__in=words)
            word_set.words.add(*words_to_add)

            return JsonResponse({'success': True, 'message': 'WordSet created successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)


@csrf_exempt
def update_word_set(request, word_set_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            word_set = get_object_or_404(WordSet, id=word_set_id)

            new_name = data.get('name', '').strip()
            new_description = data.get('description', '').strip()
            new_words = data.get('words', [])

            # Check if the word set name is unique, if it has changed
            if word_set.name != new_name and WordSet.objects.filter(name=new_name).exclude(id=word_set_id).exists():
                return JsonResponse({'success': False, 'message': 'WordSet with this name already exists.'})

            # Check if the new list of words is unique, if it has changed
            current_words = set(word_set.words.values_list('text', flat=True))
            if set(new_words) != current_words:
                existing_word_sets = WordSet.objects.exclude(id=word_set_id)
                for existing_word_set in existing_word_sets:
                    if set(existing_word_set.words.values_list('text', flat=True)) == set(new_words):
                        return JsonResponse({'success': False, 'message': 'A WordSet with this list of words already exists.'})

            # Update name and description
            word_set.name = new_name
            word_set.description = new_description

            # Update words if they have changed
            if set(new_words) != current_words:
                words_to_add = Word.objects.filter(text__in=new_words)
                word_set.words.set(words_to_add)  # Use set method to update ManyToMany field

            word_set.save()
            return JsonResponse({'success': True, 'message': 'WordSet updated successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)


@login_required
def get_word_set_words(request, word_set_id):
    word_set = get_object_or_404(WordSet, id=word_set_id)
    words = word_set.words.values_list('text', flat=True)

    response_data = {
        'words': list(words),
    }

    return JsonResponse(response_data)


def list_word_sets(request):
    word_sets = WordSet.objects.all()
    data = [{"id": ws.id, "name": ws.name, "description": ws.description} for ws in word_sets]
    return JsonResponse({"word_sets": data})


@csrf_exempt
@login_required
def delete_word_set(request, word_set_id):
    if request.method == 'POST':
        try:
            word_set = get_object_or_404(WordSet, id=word_set_id)
            word_set.delete()
            return JsonResponse({'success': True, 'message': 'WordSet deleted successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)
