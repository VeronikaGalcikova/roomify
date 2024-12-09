from django.db import models
import uuid
from card.models import Card


class RoomReader(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    ip = models.GenericIPAddressField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"Room Reader {self.name} ({self.ip})"
    
    
class UserAgreement(models.Model):
    STATUS_TYPES = (
        ('allowed', 'Allowed'),
        ('not_allowed', 'Not Allowed'),
        ('pending', 'Pending'),
    )

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="agreements")
    room_reader = models.ForeignKey(RoomReader, on_delete=models.CASCADE, related_name="agreements")
    status = models.CharField(max_length=15, choices=STATUS_TYPES)

    class Meta:
        unique_together = ('card', 'room_reader')

    def __str__(self):
        return f"Agreement for Card {self.card} in {self.room_reader}"
    
    
class RoomEntryLog(models.Model):
    LOG_TYPES = (
        ('entry', 'Entry'),
        ('exit', 'Exit'),
        ('denied', 'Denied'),
    )

    id = models.AutoField(primary_key=True)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    reader = models.ForeignKey(RoomReader, on_delete=models.CASCADE)
    log_type = models.CharField(max_length=10, choices=LOG_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.log_type} log for card {self.card} at reader {self.reader}"
