# wordsets/urls.py

from django.urls import path
from . import views

app_name = 'wordsets'

urlpatterns = [
    path('', views.list_word_sets, name='list_word_sets'),
    path('create/', views.create_word_set, name='create_word_set'),
    path('<int:word_set_id>/words/', views.get_word_set_words, name='get_word_set_words'),
]
