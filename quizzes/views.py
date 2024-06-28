# quizzes/views.py

from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from wordsets.models import Word,  WordSet, Definition, CefrLevel, WordType
from wordsets.utils import calculate_ratings, find_word_set_by_words
import json
import base64
from subscriptions.decorators import subscription_required


@subscription_required
def quiz_settings(request):
    """
    Renders the quiz settings page.

    This view handles the logic for retrieving and displaying quiz settings based on the selected word set.
    It also provides word count and filters for CEFR levels and word types.

    Args:
        request: The HTTP request object.

    Returns:
        HttpResponse: The rendered quiz settings page.
    """
    word_set_id = request.GET.get('word_set_id')

    if word_set_id and word_set_id != "0":
        word_set = get_object_or_404(WordSet, id=word_set_id)
        words = word_set.words.all()
        selected_word_set = word_set.id
        selected_word_set_description = word_set.description
    else:
        words = Word.objects.all()
        selected_word_set = None
        selected_word_set_description = None

    word_count = words.count()

    cefr_levels = [level.value for level in CefrLevel]
    cefr_counts = {level: words.filter(cefr_level=level).count() for level in cefr_levels}
    word_types = [word_type.value for word_type in WordType]
    word_type_counts = {word_type: words.filter(word_type=word_type).count() for word_type in word_types}

    selected_cefr_levels = cefr_levels  # Initially, all levels are selected
    selected_word_types = word_types  # Initially, all word types are selected

    max_word_count = Word.objects.all().count()  # Max word count is initially the total number of words

    filtered_words = ', '.join(words.values_list('text', flat=True))  # Initially, no filters applied
    print('selected_word_set')
    print(selected_word_set)
    context = {
        'word_count': word_count,
        'max_word_count': max_word_count,
        'cefr_levels': cefr_levels,
        'cefr_counts': cefr_counts,
        'cefr_total_counts': cefr_counts,
        'selected_cefr_levels': selected_cefr_levels,
        'word_types': word_types,
        'word_type_counts': word_type_counts,
        'word_type_total_counts': word_type_counts,
        'selected_word_types': selected_word_types,
        'filtered_words': filtered_words,  # Add filtered words text to context
        'selected_word_set': selected_word_set,
        'selected_word_set_description': selected_word_set_description,
    }

    return render(request, 'quizzes/quiz_settings.html', context)


@csrf_exempt
def update_quiz_settings(request):
    """
    Updates quiz settings based on the provided filters.

    This view handles the logic for updating quiz settings such as CEFR levels, word types, and filtered words.
    It also provides the filtered word count and other relevant data.

    Args:
        request: The HTTP request object.

    Returns:
        JsonResponse: The response containing the updated quiz settings.
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        cefr_levels = data.get('cefr_levels', [])
        word_types = data.get('word_types', [])
        is_grow = data.get('is_grow', False)
        total_word_count = data.get('total_word_count', 0)
        isSettingsChange = data.get('isSettingsChange', None)
        filtered_words_from_settings = data.get('filtered_words', [])
        use_filtered_words = data.get('use_filtered_words', False)

        print('filtered words from settings')
        print(filtered_words_from_settings)
        print('use_filtered_words')
        print(use_filtered_words)

        words = Word.objects.all()
        max_word_count = words.count()

        cefr_total_counts = {level: words.filter(cefr_level=level).count() for level in [level.value for level in CefrLevel]}
        word_type_total_counts = {word_type: words.filter(word_type=word_type).count() for word_type in [word_type.value for word_type in WordType]}

        if use_filtered_words:
            words = Word.objects.filter(text__in=filtered_words_from_settings)
        elif isSettingsChange == 'reset':
            words = Word.objects.all()
        elif isSettingsChange == 'total_word_count' and total_word_count > 0:
            # Distribute words evenly among selected categories
            filtered_words = set()
            if cefr_levels:
                words_cefr = words.filter(cefr_level__in=cefr_levels)
                for level in cefr_levels:
                    level_words = words_cefr.filter(cefr_level=level)[:total_word_count // len(cefr_levels)]
                    filtered_words.update(level_words)
            if word_types:
                words_word_type = words.filter(word_type__in=word_types)
                for word_type in word_types:
                    type_words = words_word_type.filter(word_type=word_type)[:total_word_count // len(word_types)]
                    filtered_words.update(type_words)
            words = Word.objects.filter(id__in=[word.id for word in filtered_words])
        else:
            if is_grow:
                if cefr_levels:
                    words1 = words.filter(cefr_level__in=cefr_levels)
                else:
                    words1 = Word.objects.none()

                if word_types:
                    words2 = words.filter(word_type__in=word_types)
                else:
                    words2 = Word.objects.none()

                words = (words1 | words2).distinct()
            else:
                if cefr_levels and word_types:
                    words = words.filter(cefr_level__in=cefr_levels, word_type__in=word_types)
                elif cefr_levels:
                    words = words.filter(cefr_level__in=cefr_levels)
                elif word_types:
                    words = words.filter(word_type__in=word_types)
                else:
                    words = Word.objects.none()

        word_count = words.count()
        cefr_counts = {level: words.filter(cefr_level=level).count() for level in cefr_total_counts}
        word_type_counts = {word_type: words.filter(word_type=word_type).count() for word_type in word_type_total_counts}
        filtered_words_text = ', '.join(words.values_list('text', flat=True))

        all_words = Word.objects.values_list('text', flat=True)
        unused_words = set(all_words) - set(filtered_words_text.split(', '))

        response_data = {
            'word_count': word_count,
            'max_word_count': max_word_count,
            'cefr_counts': cefr_counts,
            'cefr_total_counts': cefr_total_counts,
            'word_type_counts': word_type_counts,
            'word_type_total_counts': word_type_total_counts,
            'total_word_count': total_word_count,  # Pass back the updated total word count
            'filtered_words': filtered_words_text,
            'unused_words': ', '.join(unused_words)
        }

        return JsonResponse(response_data)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


def rules(request):
    """
    Renders the rules page.

    This view handles the logic for displaying the quiz rules.

    Args:
        request: The HTTP request object.

    Returns:
        HttpResponse: The rendered rules page.
    """
    return render(request, 'quizzes/rules.html')


def landing(request):
    """
    Renders the landing page.

    This view handles the logic for displaying the landing page with filtered words and word sets.

    Args:
        request: The HTTP request object.

    Returns:
        HttpResponse: The rendered landing page.
    """
    filtered_words = request.session.get('filtered_words', [])
    word_sets = WordSet.objects.all()
    print('filtered words ')
    print(filtered_words)
    print('wordsets ')
    print(word_sets)
    context = {
        'filtered_words': filtered_words,
        'autostart': 0,
        'word_sets': word_sets,
    }
    return render(request, 'landing.html', context)


@csrf_exempt
def start_quiz_with_word_set(request):
    """
    Starts a quiz with a selected word set.

    This view handles the logic for starting a quiz based on the selected word set and saving the filtered words to the session.

    Args:
        request: The HTTP request object.

    Returns:
        JsonResponse: The response containing the redirect URL for the landing page.
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        word_set_id = data.get('word_set_id')
        if not word_set_id:
            return JsonResponse({'success': False, 'message': 'Word set ID is required.'}, status=400)

        word_set = get_object_or_404(WordSet, id=word_set_id)
        words = word_set.words.values_list('text', flat=True)

        # Save filtered words to session
        request.session['filtered_words'] = list(words)

        return JsonResponse({'redirect_url': reverse('landing')})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)


def check_media_data(request):
    """
    Checks and returns the media data for words.

    This view handles the logic for retrieving media data (image and audio) for words.

    Args:
        request: The HTTP request object.

    Returns:
        JsonResponse: The response containing the media data for words.
    """
    words_data = []
    words = Word.objects.all()
    for word in words:
        words_data.append({
            'text': word.text,
            'has_image_data': word.image_data is not None,
            'has_audio_data': word.audio_data is not None,
        })
    return JsonResponse(words_data, safe=False)


class QuizDataView(APIView):
    """
    API view for handling quiz data.

    This view handles the logic for processing and returning quiz data based on```python
    @method_decorator(csrf_exempt)
    def post(self, request, format=None):
    """

    @method_decorator(csrf_exempt)
    def post(self, request, format=None):
        """
        Processes the quiz data based on filtered word texts.

        This method handles the logic for retrieving and processing quiz data based on the provided filtered word texts.
        It also updates the start count for the word set and calculates the ratings.

        Args:
            request: The HTTP request object.
            format: The format for the request (default is None).

        Returns:
            Response: The response containing the processed quiz data.
        """
        try:
            data = request.data
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)

        filtered_word_texts = data.get('filtered_word_texts', [])
        print(f"filtered_word_texts {filtered_word_texts}")
        if not filtered_word_texts or filtered_word_texts == ['']:
            words = Word.objects.all()
        else:
            words = Word.objects.filter(text__in=filtered_word_texts)
        
        word_set = find_word_set_by_words(filtered_word_texts)
        if word_set:
            word_set.start_count += 1
            word_set.save()
            calculate_ratings()

        return self.process_words(words)
    
    def process_words(self, words):
        """
        Processes the words and generates the quiz data.

        This method handles the logic for processing the provided words and generating the quiz data,
        including definitions, images, and sound URLs.

        Args:
            words: The queryset of Word objects to be processed.

        Returns:
            Response: The response containing the processed quiz data.
        """
        quiz_data = {}
        for word in words:
            definitions = Definition.objects.filter(word=word)
            definition_list = [
                {
                    "definition": definition.definition,
                    "translate": {
                        "ru": [{"translation": "translated text in Russian", "definition": None, "sound_url": None}],
                        "ua": [{"translation": "translated text in Ukrainian", "definition": None, "sound_url": None}]
                    }
                }
                for definition in definitions
            ]

            image_url = f"data:image/jpeg;base64,{base64.b64encode(word.image_data).decode('utf-8')}" if word.image_data else ''
            sound_url = f"data:audio/mpeg;base64,{base64.b64encode(word.audio_data).decode('utf-8')}" if word.audio_data else ''

            word_data = {
                "image_url": image_url,
                "sound_url": sound_url,
                "cefr": {
                    "level": word.cefr_level,
                    "title": CefrLevel(word.cefr_level).label
                },
                "word-types": [
                    {
                        "word-type": word.word_type,
                        "definitions": definition_list
                    }
                ]
            }
            quiz_data[word.text] = word_data

        return Response(quiz_data, status=status.HTTP_200_OK)
