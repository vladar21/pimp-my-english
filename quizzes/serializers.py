# quizzes/serializers.py

from rest_framework import serializers
from wordsets.models import WordSet, Word, Definition


class DefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Definition
        fields = ['definition', 'translate']


class WordSerializer(serializers.ModelSerializer):
    definitions = DefinitionSerializer(many=True, read_only=True)

    class Meta:
        model = Word
        fields = ['text', 'language_code', 'country_code', 'word_type', 'cefr_level', 'audio_data', 'image_data', 'definitions']


class WordSetSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True)

    class Meta:
        model = WordSet
        fields = ['name', 'description', 'rating', 'words']
