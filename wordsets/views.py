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
        words = data.get('words', [])

        if not title:
            return JsonResponse({'success': False, 'message': 'Title is required.'}, status=400)

        if WordSet.objects.filter(name=title).exists():
            return JsonResponse({'success': False, 'message': 'WordSet with this title already exists.'}, status=400)

        word_objects = Word.objects.filter(text__in=words)
        if word_objects.count() != len(words):
            return JsonResponse({'success': False, 'message': 'Some words are invalid.'}, status=400)

        word_set = WordSet.objects.create(
            name=title,
            description='',  # Add description if needed
            created_by=request.user,
            rating=0,  # Initial rating, change as needed
            author_username=request.user.username,
            author_email=request.user.email
        )

        for word in word_objects:
            WordInSet.objects.create(word=word, word_set=word_set)

        return JsonResponse({'success': True, 'message': 'WordSet created successfully.'})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@login_required
def list_word_sets(request):
    user_word_sets = WordSet.objects.filter(created_by=request.user).order_by('name')
    all_word_sets = WordSet.objects.filter(created_by__isnull=True).order_by('name')
    word_sets = list(user_word_sets) + list(all_word_sets)
    word_set_data = [{'id': ws.id, 'name': ws.name, 'user': ws.created_by is not None} for ws in word_sets]
    return JsonResponse({'word_sets': word_set_data})


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
