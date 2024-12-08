#!/bin/bash

# Wait for the database to be ready
echo "Waiting for database to be ready..."
python manage.py wait_for_db

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Create the superuser if it doesn't exist
echo "Creating superuser..."
python /app/manage.py shell <<EOF
from django.contrib.auth.models import User
from django.core.management import call_command

# Check if the user already exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@admin.com', 'admin')
    print("Superuser created!")
else:
    print("Superuser already exists.")
EOF

# Create the room reader superuser if it doesn't exist
echo "Creating room reader superuser..."
python /app/manage.py shell <<EOF
from django.contrib.auth.models import User
from django.core.management import call_command

# Check if the user already exists
if not User.objects.filter(username='room_reader_user').exists():
    User.objects.create_superuser('room_reader_user', 'room_reader_user@mail.com', 'room_reader_password')
    print("Room reader superuser created!")
else:
    print("Room reader superuser already exists.")
EOF

# Start the Django development server
echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8000