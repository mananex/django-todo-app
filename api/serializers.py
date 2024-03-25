from rest_framework import serializers
from main.models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['task_name', 'short_description', 'description']