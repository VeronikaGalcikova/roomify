from card.models import Card
from card.serializers import CardSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.permissions import IsSuperUserOrReadOnly


class CardViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOrReadOnly]

    queryset = Card.objects.all()
    serializer_class = CardSerializer
    
    @action(detail=False, methods=["post"], url_path="by-user")
    def by_user(self, request):
        """
        Custom endpoint to get cards by user ID (POST request).
        """
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"detail": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter cards by user ID
        cards = Card.objects.filter(user_id=user_id)
        if not cards.exists():
            return Response({"detail": "No cards found for this user."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(cards, many=True)
        return Response(serializer.data)