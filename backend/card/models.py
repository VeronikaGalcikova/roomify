import uuid
from django.db import models

from core import settings

class Card(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cards")
    card_id = models.CharField(max_length=100, unique=True) 
    allowed = models.BooleanField(default=False)

    def __str__(self):
        return f"Card {self.card_id} for {self.user}"