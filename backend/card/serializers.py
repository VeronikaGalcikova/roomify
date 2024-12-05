from rest_framework import serializers
from django.utils.timezone import now, localtime
from card.models import Card


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'

    def to_representation(self, instance):
        # Get the default representation of the instance
        representation = super().to_representation(instance)

        # Convert the 'expiration_date' field to local time if it exists
        if 'expiration_date' in representation and instance.expiration_date:
            representation['expiration_date'] = localtime(instance.expiration_date).isoformat()

        return representation
