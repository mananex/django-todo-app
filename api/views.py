from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from main.models import Task
from .serializers import TaskSerializer

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'Add a new task [POST]': '/add_task',
        'Get specified task [GET]':'/task/<int:id>',
        'Get tasks in the specified range [GET]': '/get_tasks/?minimal_number=minimal_number&maximal_number=maximal_number',
        'Get task count [GET]': '/get_task_count',
        'Delete a task [POST]': '/delete_task'
    }
    return Response(api_urls)

@api_view(['POST'])
def add_task(request):
    task = TaskSerializer(data = request.data)

    if task.is_valid():
        task.save()
        return Response(data = task.instance.id, status = status.HTTP_200_OK)
    else:
        return Response(status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_tasks(request):
    tasks = Task.objects.all()
    tasks_length = len(tasks)
    
    try:
        minimal_number = int(request.GET.get('minimal_number'))
        maximal_number = int(request.GET.get('maximal_number'))
    except ValueError:
        return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if maximal_number > tasks_length:
        return Response(status = status.HTTP_400_BAD_REQUEST)
    else:
        result = {}
        for task in tasks[minimal_number:maximal_number]:
            result[task.id] = { 'task_name': task.task_name,
                                'short_description': task.short_description,
                                'description': task.description }
        return Response(data = result, status = status.HTTP_200_OK)

@api_view(['GET'])
def get_task(request, task_id):
    task = Task.objects.filter(id = task_id).first()
    if task: return Response(data = task.api_response, status = status.HTTP_200_OK)
    else: return Response(status = status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_task_count(request):
    task_count = Task.objects.count()
    return Response(data = task_count, status = status.HTTP_200_OK)

@api_view(['POST'])
def delete_task(request):
    try:
        task_id = int(request.data['task_id'])
        Task.objects.filter(id = task_id).delete()
        return Response(status = status.HTTP_200_OK)
    except:
        return Response(status = status.HTTP_400_BAD_REQUEST)