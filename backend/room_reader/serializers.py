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

    def to_representation(self, instance):
        # Get the default representation of the instance
        representation = super().to_representation(instance)

        # Add the card and user to the representation if available
        if instance.card:
            representation['card_id'] = instance.card.card_id
            representation['user_id'] = instance.card.user.id
            representation['user_name'] = instance.card.user.username

        # Add the room reader's name to the representation if available
        if instance.room_reader:
            representation['room_reader_name'] = instance.room_reader.name

        return representation


class RoomEntryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomEntryLog
        fields = '__all__'

    def to_representation(self, instance):
        # Get the default representation of the instance
        representation = super().to_representation(instance)

        # Add the card to the representation if available
        if instance.card:
            representation['card_id'] = instance.card.card_id

        # Add the room reader's name to the representation if available
        if instance.reader:
            representation['reader_name'] = instance.reader.name

        return representation
