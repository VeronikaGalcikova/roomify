from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from django.urls import reverse


class UserAPITests(APITestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.users_list_url = None
        self.users_detail_url = None
        self.token_url = None
        self.user = None
        self.admin_user = None

    def setUp(self):
        # Create test users
        self.admin_user = User.objects.create_user(
            username='admin', password='adminpass', is_staff=True
        )
        self.user = User.objects.create_user(
            username='user1', password='userpass123'
        )

        # Use reverse() to dynamically generate URLs
        self.token_url = reverse('token_obtain_pair')
        self.users_list_url = reverse('user-list')
        self.users_detail_url = reverse('user-detail', args=[self.user.id])

    def _authenticate(self):
        """Obtain a token for authentication and set it in the client."""
        response = self.client.post(self.token_url, {
            'username': 'admin',
            'password': 'adminpass'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def _create_user(self):
        """Create a new user via a POST request."""
        data = {
            'username': 'new_user',
            'password': 'newpassword123',
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User'
        }
        return self.client.post(self.users_list_url, data), data

    def _partial_update_user(self):
        """Partially update the user's first name via a PATCH request."""
        data = {'first_name': 'Updated'}
        return self.client.patch(self.users_detail_url, data), data

    def _full_update_user(self):
        """Fully update the user fields via a POST request."""
        data = {
            'username': 'updated_username',
            'password': 'updated_password123',
            'email': 'updated@example.com',
            'first_name': 'UpdatedFirst',
            'last_name': 'UpdatedLast',
        }
        return self.client.put(self.users_detail_url, data), data

    def _delete_user(self):
        """Delete the user via a DELETE request."""
        return self.client.delete(self.users_detail_url)

    def test_token_obtain(self):
        """Test obtaining access and refresh tokens with valid credentials."""
        response = self.client.post(self.token_url, {
            'username': 'admin',
            'password': 'adminpass'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_refresh(self):
        """Test refreshing the access token using a valid refresh token."""
        response = self.client.post(self.token_url, {
            'username': 'admin',
            'password': 'adminpass'
        })
        refresh_token = response.data['refresh']
        response = self.client.post(reverse('token_refresh'), {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_get_users_unauthenticated(self):
        """Test that unauthenticated users cannot access the list of users."""
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_users_authenticated(self):
        """Test retrieving the list of users when authenticated."""
        self._authenticate()
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_user_unauthenticated(self):
        """Test that unauthenticated users cannot create a new user."""
        response, _ = self._create_user()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_user_authenticated(self):
        """Test creating a new user when authenticated."""
        self._authenticate()
        response, create_data = self._create_user()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_user = User.objects.filter(username=create_data['username']).first()

        # Ensure the user exists in the database
        self.assertIsNotNone(created_user)

        # Verify the password is correctly hashed and stored
        if 'password' in create_data:
            self.assertTrue(created_user.check_password(create_data.pop('password')))

        # Check that each field in create_data matches the corresponding field in the created user
        for field, expected_value in create_data.items():
            self.assertEqual(getattr(created_user, field), expected_value)

    def test_partially_update_user_unauthenticated(self):
        """Test that unauthenticated users cannot update user details partially."""
        response, _ = self._partial_update_user()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_partially_update_user_authenticated(self):
        """Test updating user details partially when authenticated."""
        self._authenticate()
        response, update_data = self._partial_update_user()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()

        # Verify the password is correctly hashed and stored
        if 'password' in update_data:
            self.assertTrue(self.user.check_password(update_data.pop('password')))

        #  Check that each field in update_data matches the corresponding field in the updated user
        for field, expected_value in update_data.items():
            self.assertEqual(getattr(self.user, field), expected_value)

    def test_fully_update_user_unauthenticated(self):
        """Test that unauthenticated users cannot update user details fully."""
        response, _ = self._full_update_user()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_fully_update_user_authenticated(self):
        """Test updating user details fully when authenticated."""
        self._authenticate()
        response, update_data = self._full_update_user()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()

        # Verify the password is correctly hashed and stored
        if 'password' in update_data:
            self.assertTrue(self.user.check_password(update_data.pop('password')))

        #  Check that each field in update_data matches the corresponding field in the updated user
        for field, expected_value in update_data.items():
            self.assertEqual(getattr(self.user, field), expected_value)

    def test_delete_user_unauthenticated(self):
        """Test that unauthenticated users cannot delete user."""
        response = self._delete_user()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_user_authenticated(self):
        """Test deleting a user when authenticated."""
        self._authenticate()
        response = self._delete_user()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.user.id).exists())
