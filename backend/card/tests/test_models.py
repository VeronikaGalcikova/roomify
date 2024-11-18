from django.test import TestCase
from django.contrib.auth import get_user_model
from card.models import Card


class CardModelTest(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username="testuser", password="password")
        self.card_id = "123ABC"

    def test_create_card(self):
        """Test that a Card instance can be created successfully."""
        card = Card.objects.create(user=self.user, card_id=self.card_id, allowed=True)
        self.assertEqual(card.user, self.user)
        self.assertEqual(card.card_id, self.card_id)
        self.assertTrue(card.allowed)
        self.assertIsNotNone(card.uid)

    def test_card_string_representation(self):
        """Test the string representation of a Card."""
        card = Card.objects.create(user=self.user, card_id=self.card_id)
        self.assertEqual(str(card), f"Card {self.card_id} for {self.user}")

    def test_card_id_uniqueness(self):
        """Test that card_id must be unique."""
        Card.objects.create(user=self.user, card_id=self.card_id)
        with self.assertRaises(Exception):
            Card.objects.create(user=self.user, card_id=self.card_id)

    def test_uid_uniqueness(self):
        """Test that uid is unique."""
        card1 = Card.objects.create(user=self.user, card_id="Card1")
        card2 = Card.objects.create(user=self.user, card_id="Card2")
        self.assertNotEqual(card1.uid, card2.uid)

    def test_allowed_default_value(self):
        """Test that the default value of allowed is False."""
        card = Card.objects.create(user=self.user, card_id=self.card_id)
        self.assertFalse(card.allowed)

    def test_foreign_key_relationship(self):
        """Test the foreign key relationship between Card and User."""
        card = Card.objects.create(user=self.user, card_id=self.card_id)
        self.assertEqual(card.user, self.user)
        self.assertIn(card, self.user.cards.all())
