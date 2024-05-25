from django.contrib import admin
from .models import WordSet, Word, Definition, WordInSet

admin.site.register(WordSet)
admin.site.register(Word)
admin.site.register(Definition)
admin.site.register(WordInSet)
