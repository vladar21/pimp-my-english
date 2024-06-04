# wordsets/views.py

import json
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import WordSet, Word, WordInSet
from .forms import WordSetForm


@login_required
def list_word_sets(request):
    user_word_sets = WordSet.objects.filter(created_by=request.user).order_by('name')
    all_word_sets = WordSet.objects.filter(created_by__isnull=True).order_by('name')
    word_sets = list(user_word_sets) + list(all_word_sets)
    word_set_data = [{'id': ws.id, 'name': ws.name, 'user': ws.created_by is not None} for ws in word_sets]
    return JsonResponse({'word_sets': word_set_data})


@login_required
def create_word_set(request):
    if request.method == 'POST':
        form = WordSetForm(request.POST)
        if form.is_valid():
            word_set = form.save(commit=False)
            word_set.created_by = request.user
            word_set.save()
            return redirect('list_word_sets')
    else:
        form = WordSetForm()
    return render(request, 'wordsets/create_word_set.html', {'form': form})


@login_required
def edit_word_set(request, word_set_id):
    word_set = get_object_or_404(WordSet, id=word_set_id)
    if request.method == 'POST':
        form = WordSetForm(request.POST, instance=word_set)
        if form.is_valid():
            form.save()
            return redirect('list_word_sets')
    else:
        form = WordSetForm(instance=word_set)
    return render(request, 'wordsets/edit_word_set.html', {'form': form})

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
