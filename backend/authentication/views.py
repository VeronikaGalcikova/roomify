from authentication.serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer
from rest_framework import viewsets
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from core.permissions import IsSuperUserOnly, IsAuthenticatedUser
from core.utils import validate_pagination_params, filter_and_paginate_queryset


class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'get_filtered_users':
            return [IsAuthenticatedUser()]
        return [IsSuperUserOnly()]

    @action(detail=False, methods=['post'], url_path='filter')
    def get_filtered_users(self, request):
        # Validate pagination parameters
        pagination = validate_pagination_params(request.data.get('page'), request.data.get('limit'))
        if isinstance(pagination, Response):
            # If validation fails, return the Response object
            return pagination

        # Unpack validated values
        page = pagination['page']
        limit = pagination['limit']

        # Build filters based on optional parameters
        filters = Q()
        if user_id := request.data.get('id'):
            try:
                filters &= Q(id=int(user_id))  # Filter by exact ID
            except ValueError:
                return Response(
                    {"detail": "'id' should be an integer."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if username := request.data.get('username'):
            filters &= Q(username__icontains=username)  # Filter by username containing the substring

        if email := request.data.get('email'):
            filters &= Q(email__icontains=email)  # Filter by email containing the substring

        # Apply filters to the queryset, paginate it and return as serialized response
        return filter_and_paginate_queryset(self, filters, page, limit)
    

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['first_name'] = data.get('first_name', '')
        data['last_name'] = data.get('last_name', '')
        
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
