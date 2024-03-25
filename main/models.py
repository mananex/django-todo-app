from django.db import models

# Create your models here.
class Task(models.Model):
    task_name = models.TextField()
    short_description = models.TextField()
    description = models.TextField()
    
    def __str__(self) -> str:
        return self.task_name
    
    # reponse JSON for API
    @property
    def api_response(self) -> dict:
        return {
            'task_id': self.id,
            'task_name': self.task_name,
            'short_description': self.short_description,
            'description': self.description
        }