from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from card.models import Card


class CardAPITests(APITestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.User = None
        self.user = None
        self.card = None
        self.card_detail_url = None
        self.card_list_url = None

    def setUp(self):
        # Create a user
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username="testuser", password="password")

        # Create a test card
        self.card = Card.objects.create(user=self.user, card_id="123ABC", allowed=True)

        # Store urls for endpoints
        self.card_list_url = reverse("card-list")
        self.card_detail_url = reverse("card-detail", kwargs={"pk": self.card.uid})

    def _authenticate(self):
        """Authenticate user."""
        self.client.force_authenticate(user=self.user)

    def _create_card(self):
        """Create a new card via POST request."""
        data = {"user": self.user.id, "card_id": "456DEF", "allowed": False}
        return self.client.post(self.card_list_url, data), data

    def _full_update_card(self):
        """Fully update a card via PUT request."""
        data = {"card_id": "UpdatedCard", "allowed": True, "user": self.user.id}
        return self.client.put(self.card_detail_url, data), data

    def _partial_update_card(self):
        """Partially update a card via PATCH request."""
        data = {"allowed": False}
        return self.client.patch(self.card_detail_url, data), data

    def _delete_card(self):
        """Delete a card via DELETE request."""
        return self.client.delete(self.card_detail_url)

    def test_get_cards_unauthenticated(self):
        """Test that unauthenticated users cannot access the list of cards."""
        response = self.client.get(self.card_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_cards_authenticated(self):
        """Test retrieving a list of cards when authenticated."""
        self._authenticate()
        response = self.client.get(self.card_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["card_id"], self.card.card_id)

    def test_get_card_unauthenticated(self):
        """Test unauthenticated users cannot retrieve a card."""
        response = self.client.get(self.card_detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_card_authenticated(self):
        """Test retrieving a card when authenticated."""
        self._authenticate()
        response = self.client.get(self.card_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["card_id"], self.card.card_id)

    def test_create_card_unauthenticated(self):
        """Test that unauthenticated users cannot create a card."""
        response, _ = self._create_card()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_card_authenticated(self):
        """Test creating a new card when authenticated."""
        self._authenticate()
        response, create_data = self._create_card()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_card = Card.objects.filter(card_id=create_data['card_id']).first()
        self.assertIsNotNone(created_card)

        # Check that created card has correct attributes
        for field, expected_value in create_data.items():
            if field == "user":
                self.assertEqual(created_card.user.id, expected_value)  # Compare user ID
            else:
                self.assertEqual(getattr(created_card, field), expected_value)

    def test_full_update_card_unauthenticated(self):
        """Test that unauthenticated users cannot update a card."""
        response, _ = self._full_update_card()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_full_update_card_authenticated(self):
        """Test updating card details fully when authenticated."""
        self._authenticate()
        response, update_data = self._full_update_card()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.card.refresh_from_db()

        # Verify updated fields
        for field, expected_value in update_data.items():
            if field == "user":
                self.assertEqual(self.card.user.id, expected_value)  # Compare user ID
            else:
                self.assertEqual(getattr(self.card, field), expected_value)

    def test_partial_update_card_unauthenticated(self):
        """Test unauthenticated users cannot partially update a card."""
        response, _ = self._partial_update_card()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_partial_update_card_authenticated(self):
        """Test updating card details partially when authenticated."""
        self._authenticate()
        response, update_data = self._partial_update_card()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.card.refresh_from_db()

        # Verify updated fields
        for field, expected_value in update_data.items():
            if field == "user":
                self.assertEqual(self.card.user.id, expected_value)  # Compare user ID
            else:
                self.assertEqual(getattr(self.card, field), expected_value)

    def test_delete_card_unauthenticated(self):
        """Test unauthenticated users cannot delete a card."""
        response = self._delete_card()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_card_authenticated(self):
        """Test deleting a card when authenticated."""
        self._authenticate()
        response = self._delete_card()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Card.objects.filter(uid=self.card.uid).exists())
