# quizzes/forms.py

from django import forms


class QuizSettingsForm(forms.Form):
    """
    Form for configuring quiz settings.

    Fields:
        cefr_levels (MultipleChoiceField): Select multiple CEFR levels for the quiz. Uses checkbox widgets.
        word_types (MultipleChoiceField): Select multiple word types for the quiz. Uses checkbox widgets.
        word_count (IntegerField): Set the number of words in the quiz. Uses a number input widget.
    """

    cefr_levels = forms.MultipleChoiceField(
        choices=[
            ('A1', 'A1'), ('A2', 'A2'), ('B1', 'B1'),
            ('B2', 'B2'), ('C1', 'C1'), ('C2', 'C2')
        ],
        widget=forms.CheckboxSelectMultiple,
        required=False
    )
    word_types = forms.MultipleChoiceField(
        choices=[
            ('noun', 'Noun'), ('adjective', 'Adjective'),
            ('verb', 'Verb'), ('adverb', 'Adverb'),
            ('preposition', 'Preposition'), ('pronoun', 'Pronoun'),
            ('interjection', 'Interjection')
        ],
        widget=forms.CheckboxSelectMultiple,
        required=False
    )
    word_count = forms.IntegerField(
        min_value=3,
        initial=3,
        widget=forms.NumberInput(attrs={'id': 'word-count-slider'})
    )
