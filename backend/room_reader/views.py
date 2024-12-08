from core.utils import validate_pagination_params, filter_and_paginate_queryset
from core.validators import is_valid_uuid
from room_reader.models import RoomEntryLog, RoomReader, UserAgreement
from room_reader.serializers import RoomEntryLogSerializer, RoomReaderSerializer, UserAgreementSerializer
from rest_framework import viewsets, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.permissions import IsSuperUserOrReadOnly, IsSuperUserOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q


class RoomReaderViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOrReadOnly]

    queryset = RoomReader.objects.all()
    serializer_class = RoomReaderSerializer

    @action(detail=False, methods=['post'], url_path='filter')
    def get_filtered_room_readers(self, request):
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
        if uid := request.data.get('uid'):
            filters &= Q(uid__icontains=uid)  # Filter by UID containing the substring

        if name := request.data.get('name'):
            filters &= Q(name__icontains=name)  # Filter by name containing the substring

        if ip := request.data.get('ip'):
            filters &= Q(ip__icontains=ip)  # Filter by IP containing the substring

        if active := request.data.get('active'):
            # Ensure the `active` value is a boolean
            if isinstance(active, bool):
                filters &= Q(active=active)
            else:
                # Convert string "true"/"false" to boolean
                if str(active).lower() == 'true':
                    filters &= Q(active=True)
                elif str(active).lower() == 'false':
                    filters &= Q(active=False)
                else:
                    return Response(
                        {"detail": "'active' should be a boolean or 'true'/'false' string."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        # Apply filters to the queryset, paginate it and return as serialized response
        return filter_and_paginate_queryset(self, filters, page, limit)


class UserAgreementViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOnly]

    queryset = UserAgreement.objects.all()
    serializer_class = UserAgreementSerializer

    @action(detail=False, methods=['post'], url_path='verify')
    def verify(self, request):
        card_id = request.data.get('card')
        room_reader_id = request.data.get('room_reader')

        # Validate presence of fields
        if not card_id or not room_reader_id:
            return Response(
                {"detail": "Both 'card' and 'room_reader' fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate UUID format
        if not is_valid_uuid(card_id):
            return Response(
                {"detail": f"'card' field must be a valid UUID: {card_id} is invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not is_valid_uuid(room_reader_id):
            return Response(
                {"detail": f"'room_reader' field must be a valid UUID: {room_reader_id} is invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Query the database
        try:
            agreement = UserAgreement.objects.get(card_id=card_id, room_reader_id=room_reader_id)

            log_type = 'denied' if not agreement.access else 'entry'
            RoomEntryLog.objects.create(card_id=card_id, reader_id=room_reader_id, log_type=log_type)

            return Response(
                {"access": agreement.access},
                status=status.HTTP_200_OK
            )
        except UserAgreement.DoesNotExist:
            return Response(
                {"detail": "User agreement does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )


class RoomEntryLogViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOnly]

    queryset = RoomEntryLog.objects.all()
    serializer_class = RoomEntryLogSerializer
