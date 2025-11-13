from django.db import models
from django.utils import timezone

class Department(models.Model):
    dept_name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=300, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.dept_name
    
    def soft_delete(self):
        """ SOFT DELETE BY SETTING STATUS TO FALSE """
        self.status = False
        self.updated_at = timezone.now()
        self.save()
