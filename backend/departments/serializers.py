from rest_framework import serializers
from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'dept_name', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_dept_name(self, value):
        # Check for unique department name (case insensitive)
        if Department.objects.filter(dept_name__iexact=value, status=True).exists():
            if not self.instance or self.instance.dept_name.lower() != value.lower():
                raise serializers.ValidationError("Department with this name already exists.")
        return value.strip()
