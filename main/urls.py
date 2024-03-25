from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name = 'main'),
    path('app', views.app, name = 'app'),
]