# wordsets/views.py

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import WordSet, Word, WordInSet
import json


@csrf_exempt
def create_word_set(request):
    if request.method == 'POST':
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

        word_objects = Word.objects.filter(text__in=words)
        if word_objects.count() != len(words):
            return JsonResponse({'success': False, 'message': 'Some words are invalid.'}, status=400)

        word_set = WordSet.objects.create(
            name=title,
            description=description,
            created_by=request.user,
            rating=0,  # Initial rating, change as needed
            author_username=request.user.username,
            author_email=request.user.email
        )

        for word in word_objects:
            WordInSet.objects.create(word=word, word_set=word_set)

        return JsonResponse({'success': True, 'message': 'WordSet created successfully.'})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


def list_word_sets(request):
    word_sets = WordSet.objects.all()
    data = [{"id": ws.id, "name": ws.name, "description": ws.description} for ws in word_sets]
    return JsonResponse({"word_sets": data})


def delete_word_set(request, wordset_id):
    if request.method == 'POST':
        word_set = get_object_or_404(WordSet, id=wordset_id)
        word_set.delete()
        return JsonResponse({'success': True, 'message': 'WordSet deleted successfully.'})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@method_decorator(csrf_exempt, name='dispatch')
class CreateWordSetView(View):
    def post(self, request):
        data = json.loads(request.body)
        title = data.get('title')
        words = data.get('words', [])

        if not title:
            return JsonResponse({'success': False, 'message': 'Title is required.'}, status=400)

        if WordSet.objects.filter(name=title).exists():
            return JsonResponse({'success': False, 'message': 'WordSet with this title already exists.'}, status=400)

        wordset = WordSet.objects.create(name=title, description='Auto-generated WordSet')
        for word_text in words:
            word = Word.objects.filter(text=word_text).first()
            if word:
                WordInSet.objects.create(word=word, word_set=wordset)

        return JsonResponse({'success': True, 'message': 'WordSet created successfully.'})


@login_required
def get_word_set_words(request, word_set_id):
    word_set = get_object_or_404(WordSet, id=word_set_id)
    words = word_set.words.all()
    word_count = words.count()
    cefr_counts = {level: words.filter(cefr_level=level).count() for level in [level.value for level in Word.CEFR_LEVELS]}
    word_type_counts = {word_type: words.filter(word_type=word_type).count() for word_type in [word_type.value for word_type in Word.WORD_TYPES]}

    response_data = {
        'word_count': word_count,
        'cefr_counts': cefr_counts,
        'word_type_counts': word_type_counts,
        'max_word_count': word_count,
        'cefr_levels': [level for level, count in cefr_counts.items() if count > 0],
        'word_types': [word_type for word_type, count in word_type_counts.items() if count > 0],
    }

    return JsonResponse(response_data)
