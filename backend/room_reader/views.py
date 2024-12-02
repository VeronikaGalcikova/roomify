from room_reader.models import RoomEntryLog, RoomReader, UserAgreement
from room_reader.serializers import RoomEntryLogSerializer, RoomReaderSerializer, UserAgreementSerializer
from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.permissions import IsSuperUserOrReadOnly, IsSuperUserOnly


class RoomReaderViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOrReadOnly]

    queryset = RoomReader.objects.all()
    serializer_class = RoomReaderSerializer


class UserAgreementViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOnly]

    queryset = UserAgreement.objects.all()
    serializer_class = UserAgreementSerializer


class RoomEntryLogViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOnly]

    queryset = RoomEntryLog.objects.all()
    serializer_class = RoomEntryLogSerializer
