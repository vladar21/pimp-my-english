# quizzes/serializers.py

from rest_framework import serializers
from wordsets.models import WordSet, Word, Definition


class DefinitionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Definition model.

    This serializer handles the conversion of Definition model instances into
    JSON format and vice versa. It includes fields for the definition and translations.

    Meta:
        model (Definition): The model being serialized.
        fields (list): The fields to include in the serialized output.
    """

    class Meta:
        model = Definition
        fields = ['definition', 'translate']


class WordSerializer(serializers.ModelSerializer):
    """
    Serializer for the Word model.

    This serializer handles the conversion of Word model instances into JSON format
    and vice versa. It includes fields for text, language code, country code, word type,
    CEFR level, audio data, image data, and associated definitions.

    Meta:
        model (Word): The model being serialized.
        fields (list): The fields to include in the serialized output.
    """
    
    definitions = DefinitionSerializer(many=True, read_only=True)

    class Meta:
        model = Word
        fields = ['text', 'language_code', 'country_code', 'word_type', 'cefr_level', 'audio_data', 'image_data', 'definitions']


class WordSetSerializer(serializers.ModelSerializer):
    """
    Serializer for the WordSet model.

    This serializer handles the conversion of WordSet model instances into JSON format
    and vice versa. It includes fields for name, description, rating, and associated words.

    Meta:
        model (WordSet): The model being serialized.
        fields (list): The fields to include in the serialized output.
    """
    
    words = WordSerializer(many=True, read_only=True)

    class Meta:
        model = WordSet
        fields = ['name', 'description', 'rating', 'words']
