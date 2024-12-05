from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from room_reader.models import RoomReader


class RoomReaderAPITests(APITestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.User = None
        self.superuser = None
        self.room_reader = None
        self.room_reader_list_url = None
        self.room_reader_detail_url = None

    def setUp(self):
        self.User = get_user_model()
        self.superuser = self.User.objects.create_user(username="test_user", password="password", is_superuser=True)
        self.room_reader = RoomReader.objects.create(name="Main Entrance", ip="192.168.1.1", reader_state=True)
        self.room_reader_list_url = reverse("roomreader-list")
        self.room_reader_detail_url = reverse("roomreader-detail", kwargs={"pk": self.room_reader.uid})

    def _authenticate(self):
        """Authenticate user."""
        self.client.force_authenticate(user=self.superuser)

    def _create_room_reader(self):
        """Create a new room reader via POST request."""
        data = {"name": "Back Entrance", "ip": "192.168.1.2", "reader_state": True}
        return self.client.post(self.room_reader_list_url, data), data

    def _full_update_room_reader(self):
        """Fully update a room reader via PUT request."""
        data = {"name": "Updated Entrance", "ip": "192.168.1.3", "reader_state": False}
        return self.client.put(self.room_reader_detail_url, data), data

    def _partial_update_room_reader(self):
        """Partially update a room reader via PATCH request."""
        data = {"name": "Partially Updated Entrance"}
        return self.client.patch(self.room_reader_detail_url, data), data

    def _delete_room_reader(self):
        """Delete a room reader via DELETE request."""
        return self.client.delete(self.room_reader_detail_url)

    def _verify_room_reader_field_values(self, data, room_reader):
        """Verify updated fields in room reader."""
        room_reader.refresh_from_db()
        for field, expected_value in data.items():
            self.assertEqual(getattr(room_reader, field), expected_value)

    def test_get_room_readers_unauthenticated(self):
        """Test that unauthenticated users cannot access room readers."""
        response = self.client.get(self.room_reader_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_room_readers_authenticated(self):
        """Test retrieving a list of room readers when authenticated."""
        self._authenticate()
        response = self.client.get(self.room_reader_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], self.room_reader.name)

    def test_create_room_reader_unauthenticated(self):
        """Test that unauthenticated users cannot create a room reader."""
        response, _ = self._create_room_reader()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_room_reader_authenticated(self):
        """Test creating a new room reader when authenticated."""
        self._authenticate()
        response, create_data = self._create_room_reader()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_room_reader = RoomReader.objects.filter(name=create_data['name']).first()
        self.assertIsNotNone(created_room_reader)
        self._verify_room_reader_field_values(create_data, created_room_reader)

    def test_full_update_room_reader_unauthenticated(self):
        """Test that unauthenticated users cannot fully update a room reader."""
        response, _ = self._full_update_room_reader()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_full_update_room_reader_authenticated(self):
        """Test fully updating a room reader when authenticated."""
        self._authenticate()
        response, update_data = self._full_update_room_reader()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.room_reader.refresh_from_db()
        self._verify_room_reader_field_values(update_data, self.room_reader)

    def test_partial_update_room_reader_unauthenticated(self):
        """Test that unauthenticated users cannot partially update a room reader."""
        response, _ = self._partial_update_room_reader()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_partial_update_room_reader_authenticated(self):
        """Test partially updating a room reader when authenticated."""
        self._authenticate()
        response, update_data = self._partial_update_room_reader()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.room_reader.refresh_from_db()
        self._verify_room_reader_field_values(update_data, self.room_reader)

    def test_delete_room_reader_unauthenticated(self):
        """Test that unauthenticated users cannot delete a room reader."""
        response = self._delete_room_reader()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_room_reader_authenticated(self):
        """Test deleting a room reader when authenticated."""
        self._authenticate()
        response = self._delete_room_reader()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(RoomReader.objects.filter(uid=self.room_reader.uid).exists())
