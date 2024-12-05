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
from core.permissions import IsSuperUserOnly


class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOnly]
    
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'], url_path='filter')
    def get_filtered_users(self, request):
        # Get pagination parameters
        page = request.data.get('page')
        limit = request.data.get('limit')

        # Get optional filter parameters
        user_id = request.data.get('id')
        username = request.data.get('username')
        email = request.data.get('email')

        # Validate presence of pagination parameters
        if not page or not limit:
            return Response(
                {"detail": "Both 'page' and 'limit' fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            page = int(page)
            limit = int(limit)
        except ValueError:
            return Response(
                {"detail": "Both 'page' and 'limit' should be integers."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if page < 1 or limit < 1:
            return Response(
                {"detail": "Both 'page' and 'limit' should be greater than 0."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Apply filters based on optional parameters
        filters = Q()

        if user_id:
            try:
                filters &= Q(id=int(user_id))  # Filter by exact ID
            except ValueError:
                return Response(
                    {"detail": "'id' should be an integer."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if username:
            filters &= Q(username__icontains=username)  # Filter by username containing the substring

        if email:
            filters &= Q(email__icontains=email)  # Filter by email containing the substring

        # Apply filters to the queryset
        filtered_users = self.queryset.filter(filters)

        # Apply pagination
        start = (page - 1) * limit
        end = start + limit

        # Slice the filtered queryset
        users = filtered_users[start:end]

        # Serialize and return the response
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

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
