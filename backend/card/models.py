import uuid
from django.db import models
from datetime import timedelta
from django.utils.timezone import now
from core import settings


def default_expiration():
    return now() + timedelta(days=365)


class Card(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cards")
    card_id = models.CharField(max_length=100, unique=True)
    expiration_date = models.DateTimeField(default=default_expiration)

    def __str__(self):
        return f"Card {self.card_id} for {self.user}"
