# wordsets/urls.py

from django.urls import path
from . import views

app_name = 'wordsets'

urlpatterns = [
    path('', views.list_word_sets, name='list_word_sets'),
    path('<int:word_set_id>/words/', views.get_word_set_words, name='get_word_set_words'),
    path('<int:word_set_id>/delete/', views.delete_word_set, name='delete_word_set'),
    path('create/', views.create_or_update_word_set, name='create_word_set'),
    path('<int:word_set_id>/update/', views.create_or_update_word_set, name='update_word_set'),
]
