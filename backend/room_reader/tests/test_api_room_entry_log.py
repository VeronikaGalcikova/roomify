from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from card.models import Card
from room_reader.models import RoomReader, RoomEntryLog


class RoomEntryLogAPITests(APITestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.User = None
        self.superuser = None
        self.card = None
        self.room_reader = None
        self.room_entry_log = None
        self.room_entry_log_list_url = None
        self.room_entry_log_detail_url = None

    def setUp(self):
        self.User = get_user_model()
        self.superuser = self.User.objects.create_user(username="testuser", password="password", is_superuser=True)
        self.card = Card.objects.create(user=self.superuser, card_id="123ABC")
        self.room_reader = RoomReader.objects.create(name="Main Entrance", ip="192.168.1.1", reader_state=True)
        self.room_entry_log = RoomEntryLog.objects.create(card=self.card, reader=self.room_reader, log_type="entry")
        self.room_entry_log_list_url = reverse("roomentrylog-list")
        self.room_entry_log_detail_url = reverse("roomentrylog-detail", kwargs={"pk": self.room_entry_log.id})

    def _authenticate(self):
        """Authenticate user."""
        self.client.force_authenticate(user=self.superuser)

    def _create_room_entry_log(self):
        """Create a new room entry log via POST request."""
        data = {"card": self.card.uid, "reader": self.room_reader.uid, "log_type": "entry"}
        return self.client.post(self.room_entry_log_list_url, data), data

    def _full_update_room_entry_log(self):
        """Fully update a room entry log via PUT request."""
        data = {"card": self.card.uid, "reader": self.room_reader.uid, "log_type": "exit"}
        return self.client.put(self.room_entry_log_detail_url, data), data

    def _partial_update_room_entry_log(self):
        """Partially update a room entry log via PATCH request."""
        data = {"log_type": "denied"}
        return self.client.patch(self.room_entry_log_detail_url, data), data

    def _delete_room_entry_log(self):
        """Delete a room entry log via DELETE request."""
        return self.client.delete(self.room_entry_log_detail_url)

    def _verify_room_entry_log_field_values(self, data, room_entry_log):
        """Verify updated fields in room entry log."""
        room_entry_log.refresh_from_db()
        for field, expected_value in data.items():
            if field == "card":
                self.assertEqual(room_entry_log.card.uid, expected_value)  # Compare card ID
            elif field == "reader":
                self.assertEqual(room_entry_log.reader.uid, expected_value)  # Compare reader ID
            else:
                self.assertEqual(getattr(room_entry_log, field), expected_value)

    def test_create_room_entry_log_unauthenticated(self):
        """Test that unauthenticated users cannot create a room entry log."""
        response, _ = self._create_room_entry_log()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_room_entry_log_authenticated(self):
        """Test creating a new room entry log when authenticated."""
        self._authenticate()
        response, create_data = self._create_room_entry_log()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_entry_log = RoomEntryLog.objects.filter(
            card=create_data['card'],
            reader=create_data['reader'],
            log_type=create_data['log_type']).first()
        self.assertIsNotNone(created_entry_log)
        self._verify_room_entry_log_field_values(create_data, created_entry_log)

    def test_full_update_room_entry_log_unauthenticated(self):
        """Test that unauthenticated users cannot fully update a room entry log."""
        response, _ = self._full_update_room_entry_log()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_full_update_room_entry_log_authenticated(self):
        """Test fully updating a room entry log when authenticated."""
        self._authenticate()
        response, update_data = self._full_update_room_entry_log()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self._verify_room_entry_log_field_values(update_data, self.room_entry_log)

    def test_partial_update_room_entry_log_unauthenticated(self):
        """Test that unauthenticated users cannot partially update a room entry log."""
        response, _ = self._partial_update_room_entry_log()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_partial_update_room_entry_log_authenticated(self):
        """Test partially updating a room entry log when authenticated."""
        self._authenticate()
        response, update_data = self._partial_update_room_entry_log()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self._verify_room_entry_log_field_values(update_data, self.room_entry_log)

    def test_delete_room_entry_log_unauthenticated(self):
        """Test that unauthenticated users cannot delete a room entry log."""
        response = self._delete_room_entry_log()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_room_entry_log_authenticated(self):
        """Test deleting a room entry log when authenticated."""
        self._authenticate()
        response = self._delete_room_entry_log()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(RoomEntryLog.objects.filter(id=self.room_entry_log.id).exists())
