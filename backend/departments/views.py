from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        queryset = Department.objects.all()
        
        # FILTER BY STATUS (DEFAULT: ACTIVE ONLY)
        include_inactive = self.request.query_params.get('include_inactive', '0')
        if include_inactive != '1':  # FIXED: was '== 1'
            queryset = queryset.filter(status=True)
        
        # SEARCH FUNCTIONALITY
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(dept_name__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset.order_by('-updated_at')
    
    def destroy(self, request, *args, **kwargs):
        # SOFT DELETE INSTEAD OF HARD DELETE
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
