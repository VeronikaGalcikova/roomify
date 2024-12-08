from card.models import Card
from card.serializers import CardSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from core.permissions import IsSuperUserOrReadOnly
from core.utils import validate_pagination_params, paginate_queryset, filter_and_paginate_queryset


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

    @action(detail=False, methods=['post'], url_path='filter')
    def get_filtered_cards(self, request):
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
        if user_id := request.data.get('user_id'):
            try:
                filters &= Q(user=int(user_id))  # Filter by exact user ID
            except ValueError:
                return Response(
                    {"detail": "'user_id' should be an integer."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if user_name := request.data.get('user_name'):
            filters &= Q(user__username__icontains=user_name)  # Filter by username containing the substring

        if card_id := request.data.get('card_id'):
            filters &= Q(card_id__icontains=card_id)  # Filter by card ID containing the substring

        if card_uid := request.data.get('card_uid'):
            filters &= Q(uid__icontains=card_uid)  # Filter by card UID containing the substring

        # Apply filters to the queryset, paginate it and return as serialized response
        return filter_and_paginate_queryset(self, filters, page, limit)
