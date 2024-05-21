from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('subscribe/', views.subscribe, name='subscribe'),
    path('manage/', views.manage, name='manage'),
    path('cancel/', views.cancel, name='cancel'),
    path('payments/', views.payments, name='payments'),
]
