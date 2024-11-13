from rest_framework import serializers
from room_reader.models import RoomEntryLog, RoomReader, UserAgreement


class RoomReaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomReader
        fields = '__all__'


class UserAgreementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAgreement
        fields = '__all__'


class RoomEntryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomEntryLog
        fields = '__all__'