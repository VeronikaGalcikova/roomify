import time
from django.db import connections
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Wait for the database to be ready'

    def handle(self, *args, **kwargs):
        self.wait_for_db()
        
    def wait_for_db(self):  # Add self parameter to make it an instance method
        print("Waiting for database to be ready...")
        db_conn = connections['default']
        while True:
            try:
                db_conn.cursor()  # Try to get a cursor to the database
                print("Database is ready!")
                break
            except OperationalError:
                print("Database not ready, waiting...")
                time.sleep(1)
