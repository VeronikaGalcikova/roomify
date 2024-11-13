from django.shortcuts import render
from room_reader.models import RoomEntryLog, RoomReader, UserAgreement
from room_reader.serializers import RoomEntryLogSerializer, RoomReaderSerializer, UserAgreementSerializer
from rest_framework import viewsets


class RoomReaderViewSet(viewsets.ModelViewSet):
    queryset = RoomReader.objects.all()
    serializer_class = RoomReaderSerializer


class UserAgreementViewSet(viewsets.ModelViewSet):
    queryset = UserAgreement.objects.all()
    serializer_class = UserAgreementSerializer


class RoomEntryLogViewSet(viewsets.ModelViewSet):
    queryset = RoomEntryLog.objects.all()
    serializer_class = RoomEntryLogSerializer
