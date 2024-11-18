from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from room_reader.models import RoomReader, UserAgreement


class UserAgreementAPITests(APITestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.User = None
        self.user1 = None
        self.user2 = None
        self.room_reader = None
        self.user_agreement = None
        self.user_agreement_list_url = None
        self.user_agreement_detail_url = None

    def setUp(self):
        self.User = get_user_model()
        self.user1 = self.User.objects.create_user(username="test_user", password="password")
        self.user2 = self.User.objects.create_user(username="test_user2", password="password2")
        self.room_reader = RoomReader.objects.create(name="Main Entrance", ip="192.168.1.1", reader_state=True)
        self.user_agreement = UserAgreement.objects.create(user=self.user1, room_reader=self.room_reader, access=True)
        self.user_agreement_list_url = reverse("useragreement-list")
        self.user_agreement_detail_url = reverse("useragreement-detail", kwargs={"pk": self.user_agreement.id})

    def _authenticate(self):
        """Authenticate user."""
        self.client.force_authenticate(user=self.user1)

    def _create_user_agreement(self):
        """Create a new user agreement via POST request."""
        data = {"user": self.user2.id, "room_reader": self.room_reader.uid, "access": False}
        return self.client.post(self.user_agreement_list_url, data), data

    def _full_update_user_agreement(self):
        """Fully update a user agreement via PUT request."""
        data = {"user": self.user1.id, "room_reader": self.room_reader.uid, "access": False}
        return self.client.put(self.user_agreement_detail_url, data), data

    def _partial_update_user_agreement(self):
        """Partially update a user agreement via PATCH request."""
        data = {"access": False}
        return self.client.patch(self.user_agreement_detail_url, data), data

    def _delete_user_agreement(self):
        """Delete a user agreement via DELETE request."""
        return self.client.delete(self.user_agreement_detail_url)

    def _verify_user_agreement_field_values(self, data, user_agreement):
        """Verify updated fields in user agreement."""
        user_agreement.refresh_from_db()
        for field, expected_value in data.items():
            if field == "user":
                self.assertEqual(user_agreement.user.id, expected_value)  # Compare user ID
            elif field == "room_reader":
                self.assertEqual(user_agreement.room_reader.uid, expected_value)  # Compare room reader ID
            else:
                self.assertEqual(getattr(user_agreement, field), expected_value)

    def test_create_user_agreement_unauthenticated(self):
        """Test that unauthenticated users cannot create a user agreement."""
        response, _ = self._create_user_agreement()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_user_agreement_authenticated(self):
        """Test creating a new user agreement when authenticated."""
        self._authenticate()
        response, create_data = self._create_user_agreement()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_user_agreement = UserAgreement.objects.filter(
            user=create_data['user'], room_reader=create_data['room_reader']).first()
        self.assertIsNotNone(created_user_agreement)
        self._verify_user_agreement_field_values(create_data, created_user_agreement)

    def test_full_update_user_agreement_unauthenticated(self):
        """Test that unauthenticated users cannot fully update a user agreement."""
        response, _ = self._full_update_user_agreement()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_full_update_user_agreement_authenticated(self):
        """Test fully updating a user agreement when authenticated."""
        self._authenticate()
        response, update_data = self._full_update_user_agreement()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self._verify_user_agreement_field_values(update_data, self.user_agreement)

    def test_partial_update_user_agreement_unauthenticated(self):
        """Test that unauthenticated users cannot partially update a user agreement."""
        response, _ = self._partial_update_user_agreement()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_partial_update_user_agreement_authenticated(self):
        """Test partially updating a user agreement when authenticated."""
        self._authenticate()
        response, update_data = self._partial_update_user_agreement()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self._verify_user_agreement_field_values(update_data, self.user_agreement)

    def test_delete_user_agreement_unauthenticated(self):
        """Test that unauthenticated users cannot delete a user agreement."""
        response = self._delete_user_agreement()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_user_agreement_authenticated(self):
        """Test deleting a user agreement when authenticated."""
        self._authenticate()
        response = self._delete_user_agreement()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(UserAgreement.objects.filter(id=self.user_agreement.id).exists())
