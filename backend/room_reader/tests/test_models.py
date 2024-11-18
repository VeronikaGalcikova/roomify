from django.test import TestCase
from django.contrib.auth import get_user_model
from card.models import Card
from room_reader.models import RoomReader, UserAgreement, RoomEntryLog


class RoomReaderModelTest(TestCase):
    def setUp(self):
        self.room_reader = RoomReader.objects.create(
            name="Main Entrance",
            ip="192.168.1.1",
            reader_state=True
        )

    def test_create_room_reader(self):
        """Test that a RoomReader instance can be created successfully."""
        self.assertEqual(self.room_reader.name, "Main Entrance")
        self.assertEqual(self.room_reader.ip, "192.168.1.1")
        self.assertTrue(self.room_reader.reader_state)

    def test_room_reader_string_representation(self):
        """Test the string representation of a RoomReader."""
        self.assertEqual(str(self.room_reader), f"Room Reader {self.room_reader.name} ({self.room_reader.ip})")

    def test_uid_uniqueness(self):
        """Test that uid is unique for RoomReader."""
        another_reader = RoomReader.objects.create(name="Side Door", ip="192.168.1.2")
        self.assertNotEqual(self.room_reader.uid, another_reader.uid)

    def test_reader_state_default_value(self):
        """Test that the default value of reader_state is True."""
        reader = RoomReader.objects.create(name="Side Door", ip="192.168.1.2")
        self.assertTrue(reader.reader_state)


class UserAgreementModelTest(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username="test_user", password="password")
        self.room_reader = RoomReader.objects.create(
            name="Main Entrance",
            ip="192.168.1.1",
            reader_state=True
        )
        self.user_agreement = UserAgreement.objects.create(
            user=self.user,
            room_reader=self.room_reader,
            access=True
        )

    def test_create_user_agreement(self):
        """Test that a UserAgreement instance can be created successfully."""
        self.assertEqual(self.user_agreement.user, self.user)
        self.assertEqual(self.user_agreement.room_reader, self.room_reader)
        self.assertTrue(self.user_agreement.access)

    def test_user_agreement_string_representation(self):
        """Test the string representation of a UserAgreement."""
        self.assertEqual(
            str(self.user_agreement),
            f"Agreement for {self.user} in {self.room_reader}"
        )

    def test_unique_together_constraint(self):
        """Test the unique_together constraint on User and RoomReader."""
        with self.assertRaises(Exception):
            UserAgreement.objects.create(
                user=self.user,
                room_reader=self.room_reader,
                access=False
            )

    def test_access_default_value(self):
        """Test that the default value of access is False."""
        user = self.User.objects.create_user(username="test_user2", password="password2")
        user_agreement = UserAgreement.objects.create(user=user, room_reader=self.room_reader)
        self.assertFalse(user_agreement.access)

    def test_foreign_key_relationship_user(self):
        """Test the foreign key relationship between UserAgreement and User."""
        self.assertEqual(self.user_agreement.user, self.user)
        self.assertIn(self.user_agreement, self.user.agreements.all())

    def test_foreign_key_relationship_room_reader(self):
        """Test the foreign key relationship between UserAgreement and RoomReader."""
        self.assertEqual(self.user_agreement.room_reader, self.room_reader)
        self.assertIn(self.user_agreement, self.room_reader.agreements.all())


class RoomEntryLogModelTest(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username="test_user", password="password")
        self.card = Card.objects.create(user=self.user, card_id="123ABC")
        self.room_reader = RoomReader.objects.create(
            name="Main Entrance",
            ip="192.168.1.1",
            reader_state=True
        )
        self.entry_log = RoomEntryLog.objects.create(
            card=self.card,
            reader=self.room_reader,
            log_type="entry"
        )

    def test_create_room_entry_log(self):
        """Test that a RoomEntryLog instance can be created successfully."""
        self.assertEqual(self.entry_log.card, self.card)
        self.assertEqual(self.entry_log.reader, self.room_reader)
        self.assertEqual(self.entry_log.log_type, "entry")
        self.assertIsNotNone(self.entry_log.timestamp)

    def test_room_entry_log_string_representation(self):
        """Test the string representation of a RoomEntryLog."""
        self.assertEqual(
            str(self.entry_log),
            f"entry log for card {self.card} at reader {self.room_reader}"
        )

    def test_log_type_choices(self):
        """Test that log_type accepts only valid choices."""
        with self.assertRaises(Exception):
            RoomEntryLog.objects.create(
                card=self.card,
                reader=self.room_reader,
                log_type="invalid_type"
            )

    def test_foreign_key_relationship_card(self):
        """Test the foreign key relationship between RoomEntryLog and Card."""
        self.assertEqual(self.entry_log.card, self.card)
        self.assertIn(self.entry_log, self.card.roomentrylog_set.all())

    def test_foreign_key_relationship_reader(self):
        """Test the foreign key relationship between RoomEntryLog and RoomReader."""
        self.assertEqual(self.entry_log.reader, self.room_reader)
        self.assertIn(self.entry_log, self.room_reader.roomentrylog_set.all())
