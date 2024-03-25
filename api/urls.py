from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_overview, name = 'api_overview'),
    path('add_task/', views.add_task, name = 'api_add_task'),
    path('get_tasks/', views.get_tasks, name = 'api_get_tasks'),
    path('tasks/<int:task_id>/', views.get_task, name = 'api_get_task'),
    path('get_task_count/', views.get_task_count, name = 'api_get_task_count'),
    path('delete_task/', views.delete_task, name = 'api_delete_task'),
]