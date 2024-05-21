from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('start/', views.start, name='start'),
    path('<int:id>/', views.detail, name='detail'),
    path('<int:id>/results/', views.results, name='results'),
]
