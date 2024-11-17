from django.test import TestCase
from rest_framework.exceptions import ValidationError
from authentication.serializers import UserSerializer


class UserSerializerTestCase(TestCase):

    def test_user_serializer_fields(self):
        """Test the fields in the UserSerializer."""
        serializer = UserSerializer()
        expected_fields = ['username', 'password', 'email', 'first_name', 'last_name', 'id']
        self.assertEqual(set(serializer.fields.keys()), set(expected_fields))

    def test_user_serializer_valid_data(self):
        """Test that the UserSerializer works with valid data."""
        data = {
            'username': 'test_user',
            'password': 'password123',
            'email': 'testuser@example.com',
            'first_name': 'John',
            'last_name': 'Doe'
        }

        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()

        # Check if the user was created correctly
        self.assertEqual(user.username, data['username'])
        self.assertEqual(user.email, data['email'])
        self.assertEqual(user.first_name, data['first_name'])
        self.assertEqual(user.last_name, data['last_name'])

        # Check if the password is hashed (not the same as the plain text password)
        self.assertNotEqual(user.password, data['password'])
        self.assertTrue(user.check_password(data['password']))

    def test_user_serializer_missing_username(self):
        """Test that the UserSerializer raises an error when username is missing."""
        data = {
            'password': 'password123',
            'email': 'testuser@example.com',
            'first_name': 'John',
            'last_name': 'Doe'
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_user_serializer_missing_password(self):
        """Test that the UserSerializer raises an error when password is missing."""
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'first_name': 'John',
            'last_name': 'Doe'
        }

        serializer = UserSerializer(data=data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_user_serializer_invalid_email(self):
        """Test that the UserSerializer raises an error when email is invalid"""
        data = {
            'username': 'testuser',
            'password': 'password123',
            'email': 'invalid-email',
            'first_name': 'John',
            'last_name': 'Doe'
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
