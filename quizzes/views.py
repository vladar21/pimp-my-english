# quizzes/views.py

from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from wordsets.models import Word, Definition, CefrLevel, WordType
import json
import base64


def quiz_settings(request):
    words = Word.objects.all()
    word_count = words.count()

    cefr_levels = [level.value for level in CefrLevel]
    cefr_counts = {level: words.filter(cefr_level=level).count() for level in cefr_levels}
    word_types = [word_type.value for word_type in WordType]
    word_type_counts = {word_type: words.filter(word_type=word_type).count() for word_type in word_types}

    selected_cefr_levels = cefr_levels  # Initially, all levels are selected
    selected_word_types = word_types  # Initially, all word types are selected

    max_word_count = word_count  # Max word count is initially the total number of words

    filtered_words = ', '.join(words.values_list('text', flat=True))  # Initially, no filters applied

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
    }

    return render(request, 'quizzes/quiz_settings.html', context)


@csrf_exempt
def update_quiz_settings(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cefr_levels = data.get('cefr_levels', [])
        word_types = data.get('word_types', [])
        is_grow = data.get('is_grow', False)
        total_word_count = data.get('total_word_count', 0)
        isSettingsChange = data.get('isSettingsChange', None)
        # filtered_words_from_settings = data.get('filtered_words')
        # use_filtered_words = data.get('use_filtered_words')
        filtered_words_from_settings = data.get('filtered_words', [])
        use_filtered_words = data.get('use_filtered_words', False)

        print('filtered words from settings')
        print(filtered_words_from_settings)

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
    return render(request, 'quizzes/rules.html')


@csrf_exempt
def submit_quiz_settings(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        filtered_words = data.get('filtered_words', [])

        # Save filtered words to session
        request.session['filtered_words'] = filtered_words

        # Redirect to landing page
        redirect_url = f"{reverse('landing')}"
        return JsonResponse({'redirect_url': redirect_url})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=400)


def landing(request):
    filtered_words = request.session.get('filtered_words', [])
    context = {
        'filtered_words': filtered_words,
        'autostart': 1,
    }
    return render(request, 'landing.html', context)


@api_view(['POST'])
def submit_quiz_result(request):
    # Логика обработки результатов викторины
    return Response({"message": "Quiz result submitted successfully."}, status=status.HTTP_201_CREATED)


def check_media_data(request):
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
    @method_decorator(csrf_exempt)
    def post(self, request, format=None):
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

        return self.process_words(words)
    
    def process_words(self, words):
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

    # def get(self, request, format=None):
    #     # Query all words from the database
    #     words = Word.objects.all()
        
    #     # Structure the data as needed for the quiz
    #     quiz_data = {}
    #     for word in words:
    #         definitions = Definition.objects.filter(word=word)
    #         definition_list = [
    #             {
    #                 "definition": definition.definition,
    #                 "translate": {
    #                     "ru": [{"translation": "translated text in Russian", "definition": None, "sound_url": None}],
    #                     "ua": [{"translation": "translated text in Ukrainian", "definition": None, "sound_url": None}]
    #                     # Add more translations if necessary
    #                 }
    #             }
    #             for definition in definitions
    #         ]
            
    #         # Convert binary data to base64-encoded strings
    #         image_url = f"data:image/jpeg;base64,{base64.b64encode(word.image_data).decode('utf-8')}" if word.image_data else ''
    #         sound_url = f"data:audio/mpeg;base64,{base64.b64encode(word.audio_data).decode('utf-8')}" if word.audio_data else ''

    #         word_data = {
    #             "image_url": image_url,
    #             "sound_url": sound_url,
    #             "cefr": {
    #                 "level": word.cefr_level,
    #                 "title": CefrLevel(word.cefr_level).label
    #             },
    #             "word-types": [
    #                 {
    #                     "word-type": word.word_type,
    #                     "definitions": definition_list
    #                 }
    #             ]
    #         }
    #         quiz_data[word.text] = word_data

    #     return Response(quiz_data, status=status.HTTP_200_OK)

# class QuizDataView(APIView):
#     def get(self, request, format=None):
#         # Захардкоженные данные в нужном формате
#         quiz_data = {    
#             "humanity": {
#                 "image_url": 'static/images/quiz_images/humanity.webp',
#                 "sound_url": 'static/sound/humanity.mp3',
#                 "cefr": {
#                     "level": "C2",
#                     "title": "Proficient"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "noun",
#                         "definitions": [
#                             {
#                                 "definition": "all people.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'человечество',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },                  
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "kindness and sympathy towards others.",
#                                 "translate": {
#                                     "ru": [ 
#                                         {
#                                             "translation": 'человечность',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },        
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "the condition of being human.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'гуманность',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "kindness.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'гуманність',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'людяність',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },                
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "people in general.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'людська природа',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },    
#                                         {
#                                             "translation": 'людство',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },                  
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "understanding and kindness towards other people.",
#                                 "translate": 'null',
#                             },
#                             {
#                                 "definition": "all people in the world as a whole, or the qualities characteristic of people",
#                                 "translate": 'null',
#                             },
#                         ],
#                     },
#                 ],
#             },
#             "charisma": {
#                 "image_url": 'static/images/quiz_images/charisma.webp',
#                 "sound_url": 'static/sound/charisma.mp3',
#                 "cefr": {
#                     "level": "C1",
#                     "title": "Advanced"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "noun",
#                         "definitions": [
#                             {
#                                 "definition": "a natural power that some people have to influence or attract people.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'харизма',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'притягательная сила',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },               
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "a strong personal quality that makes someone attract, influence, and inspire other people",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'харизма',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },              
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition":  "a special power that some people have naturally that makes them able to influence other people and attract their attention and admiration",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition":  "the ability to attract the attention and admiration of others, and to be seen as a leader",
#                                 "translate": 'null'
#                             },
#                         ],
#                     }
#                 ],
#             },
#             "blunt": {
#                 "image_url": "static/images/quiz_images/blunt.webp",
#                 "sound_url": "static/sound/blunt.mp3",
#                 "cefr": {
#                     "level": "C2",
#                     "title": "Proficient"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "adjective",
#                         "definitions": [
#                             {
#                                 "definition": "not sharp.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'тупой',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "saying what you think without trying to be polite or considering other people's feelings.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'прямой',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'резкий',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },     
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "(of objects) having no point or sharp edge.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'тупий',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "(of people) (sometimes unpleasantly) straightforward or frank in speech.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'грубувато-прямий',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },    
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "A blunt pencil, knife, etc. is not sharp and therefore not able to write, cut, etc. well.",
#                                 "translate": 'null'
#                             },
#                         ],
#                     },
#                     {
#                         "word-type": "verb",
#                         "definitions": [
#                             {
#                                 "definition": "to make a feeling less strong.",                        
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'ослаблять',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'притуплять',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "to make something less sharp.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'затуплять',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },     
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "to make less sharp",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'притуплювати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'притуплюватися',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             },                    
#                         ],
#                     },
#                 ],       
#             },
#             "cynical": {
#                 "image_url": "static/images/quiz_images/cynical.webp",
#                 "sound_url": "static/sound/cynical.mp3",
#                 "cefr": {
#                     "level": "C2",
#                     "title": "Proficient"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "adjective",
#                         "definitions": [
#                             {
#                                 "definition": "inclined to believe the worst, especially about people.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'цинічний',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'безсоромний',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },    
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "believing that people are only interested in themselves and are not sincere.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'циничный',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "saying what you think without trying to be polite or considering other people's feelings.",
#                                 "translate": 'null'
#                             }
#                         ],
#                     },
#                 ],       
#             },
#             "fussy": {
#                 "image_url": "static/images/quiz_images/fussy.webp",
#                 "sound_url": "static/sound/fussy.mp3",
#                 "cefr": {
#                     "level": "C2",
#                     "title": "Proficient"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "adjective",
#                         "definitions": [
#                             {
#                                 "definition": "only liking particular things and very difficult to please.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'привередливый',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 },
#                             },
#                             {
#                                 "definition": "too careful about unimportant details.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'придирчивый',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "it is too complicated in design and has too many details.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'вычурный',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'аляповатый',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "too concerned with details; too particular; difficult to satisfy.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'метушливий',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'перебірливий',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },    
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "(of clothes etc) with too much decoration.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'з витребеньками',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },   
#                                     ],
#                                 }
#                             }
#                         ],
#                     },
#                 ],       
#             },
#             "smooth": {
#                 "image_url": "static/images/quiz_images/smooth.webp",
#                 "sound_url": "static/sound/smooth.mp3",
#                 "cefr": {
#                     "level": "C2",
#                     "title": "Intermediate"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "adjective",
#                         "definitions": [
#                             {
#                                 "definition": "having a regular surface that has no holes or lumps in it.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'гладкий',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'ровный',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "a substance that is smooth has no lumps in it.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'однородный',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'без комков',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },     
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "happening without any sudden movements or changes.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'плавный',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "happening without problems or difficulties.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'легкий',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'спокойный',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "too polite and confident in a way that people do not trust.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'вкрадчивый',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'сладкоголосый',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "having an even surface; not rough.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'гладенький',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },    
#                                         {
#                                             "translation": 'рівний',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },    
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "without lumps.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'однорідний',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "(of movement) without breaks, stops or jolts.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'плавний',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                         {
#                                             "translation": 'спокійний',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "without problems or difficulties.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'безпроблемний',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                         {
#                                             "translation": 'гладенький',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "(too) agreeable and pleasant in manner etc.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'улесливий',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                         {
#                                             "translation": 'солодкомовний',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "having a surface or consisting of a substance that is perfectly regular and has no holes, lumps, or areas that rise or fall suddenly.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "happening without any sudden changes, interruption, or difficulty.",
#                                 "translate": 'null'
#                             },
#                         ],
#                     },
#                     {
#                         "word-type": "verb",
#                         "definitions": [
#                             {
#                                 "definition": "to move your hands across something in order to make it flat.",                        
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'разглаживать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'приглаживать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "(often with down, out etc) to make (something) smooth or flat.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'згладжувати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                         {
#                                             "translation": 'вирівнювати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "(with into or over) to rub (a liquid substance etc) gently over (a surface).",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'змащувати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                         {
#                                             "translation": 'мастити',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },   
#                         ],
#                     },
#                 ],       
#             },
#             "embrace": {
#                 "image_url": "static/images/quiz_images/embrace.webp",
#                 "sound_url": "static/sound/embrace.mp3",
#                 "cefr": {
#                     "level": "C1",
#                     "title": "Advanced"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "noun",
#                         "definitions": [
#                             {
#                                 "definition": "the action of putting your arms around someone.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'объятие',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "a clasping in the arms; a hug.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'обійми',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                         ],
#                     },
#                     {
#                         "word-type": "verb",
#                         "definitions": [
#                             {
#                                 "definition": "If you embrace someone, you put your arms around them, and if two people embrace, they put their arms around each other.",                        
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'обнимать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'обниматься',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "to accept new ideas, beliefs, methods, etc in an enthusiastic way.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'воспринимать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                         {
#                                             "translation": 'принимать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "to include a number of things.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'включать в себя',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "to take (a person etc) in the arms; to hug.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'обнімати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },   
#                             {
#                                 "definition": "to accept something enthusiastically.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "to hold someone tightly with both arms to express love, liking, or sympathy, or when greeting or leaving someone.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "to include something, often as one of a number of things.",
#                                 "translate": 'null'
#                             },
#                         ],
#                     },
#                 ],       
#             },
#             "survey": {
#                 "image_url": "static/images/quiz_images/survey.webp",
#                 "sound_url": "static/sound/survey.mp3",
#                 "cefr": {
#                     "level": "C1",
#                     "title": "Advanced"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "noun",
#                         "definitions": [
#                             {
#                                 "definition": "an examination of people's opinions or behaviour made by asking people questions.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'опрос общественного мнения',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "an examination of the structure of a building in order to find out if there is anything wrong with it.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'техническая инспекция здания',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "an examination of an area of land in which its measurements and details are recorded, especially in order to make a map.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'межевание',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'съемка',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "a look or examination; a report.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'огляд',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                         {
#                                             "translation": 'обслідування',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "a careful measurement of land etc.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'межування',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                         {
#                                             "translation": 'промірювання',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "an examination of opinions, behaviour, etc., made by asking people questions.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "the measuring and recording of the details of an area of land.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "a description of the whole of a subject.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "an examination of the structure of a building by a specially trained person.",
#                                 "translate": 'null'
#                             },
#                         ],
#                     },
#                     {
#                         "word-type": "verb",
#                         "definitions": [
#                             {
#                                 "definition": "to look at or examine something carefully.",                        
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'осматривать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'исследовать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "to ask people questions in order to find out about their opinions or behaviour.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'опрашивать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         }, 
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "to measure and record the details of an area of land.",
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'межевать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'производить съемку',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },
#                             {
#                                 "definition": "to look at, or view, in a general way.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'оглядати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'вивчати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },   
#                             {
#                                 "definition": "to examine carefully or in detail.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'провадити дослідження',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },   
#                             {
#                                 "definition": "to measure, and estimate the position, shape etc of (a piece of land etc).",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'провадити землемірне знімання',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'межувати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },   
#                             {
#                                 "definition": "to make a formal or official inspection of (a house etc that is being offered for sale).",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'оцінювати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'провадити передпродажну інспекцію',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },   
#                             {
#                                 "definition": "to measure an area of land, and to record the details of it, especially on a map.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "If a building is surveyed, it is examined carefully by a specially trained person, in order to discover if there is anything wrong with its structure.",
#                                 "translate": 'null'
#                             },
#                         ],
#                     },
#                 ],       
#             },
#             "opt": {
#                 "image_url": "static/images/quiz_images/opt.webp",
#                 "sound_url": "static/sound/opt.mp3",
#                 "cefr": {
#                     "level": "C1",
#                     "title": "Advanced"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "verb",
#                         "definitions": [
#                             {
#                                 "definition": "to choose something or to decide to do something.",                        
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'делать выбор',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'предпочитать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             }, 
#                             {
#                                 "definition": "to choose or decide not to do something or take part in something.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'вибирати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'ухилятися',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },   
#                             {
#                                 "definition": "to make a choice, especially of one thing or possibility instead of others.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "to make a choice, esp. for one thing or possibility in preference to any others.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "to choose one thing or possibility rather than others.",
#                                 "translate": 'null'
#                             },
#                         ],
#                     },
#                 ],       
#             },
#             "abandon": {
#                 "image_url": "static/images/quiz_images/opt.webp",
#                 "sound_url": "static/sound/opt.mp3",
#                 "cefr": {
#                     "level": "C1",
#                     "title": "Advanced"
#                 },
#                 "word-types": [
#                     {
#                         "word-type": "verb",
#                         "definitions": [
#                             {
#                                 "definition": "to choose something or to decide to do something.",                        
#                                 "translate": {
#                                     "ru": [
#                                         {
#                                             "translation": 'делать выбор',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'предпочитать',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },  
#                                     ],
#                                 }
#                             }, 
#                             {
#                                 "definition": "to choose or decide not to do something or take part in something.",
#                                 "translate": {
#                                     "ua": [
#                                         {
#                                             "translation": 'вибирати',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                         {
#                                             "translation": 'ухилятися',
#                                             "definition": 'null',
#                                             "sound_url": 'null',
#                                         },
#                                     ],
#                                 }
#                             },   
#                             {
#                                 "definition": "to make a choice, especially of one thing or possibility instead of others.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "to make a choice, esp. for one thing or possibility in preference to any others.",
#                                 "translate": 'null'
#                             },
#                             {
#                                 "definition": "to choose one thing or possibility rather than others.",
#                                 "translate": 'null'
#                             },
#                         ],
#                     },
#                 ],       
#             },
#         }

#         return Response(quiz_data, status=status.HTTP_200_OK)

