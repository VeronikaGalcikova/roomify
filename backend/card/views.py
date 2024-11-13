from django.shortcuts import render
from card.models import Card
from card.serializers import CardSerializer
from rest_framework import viewsets


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
