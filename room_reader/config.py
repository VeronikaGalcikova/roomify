from dotenv import load_dotenv
import os


load_dotenv()


class Config(object):
    # Configuration variables
    ROOM_READER_USER = os.getenv('ROOM_READER_USER', 'room_reader_user')
    ROOM_READER_PASSWORD = os.getenv('ROOM_READER_PASSWORD', 'room_reader_password')
    BACKEND_BASE_URL = os.getenv('BACKEND_BASE_URL', 'http://localhost:8000')
    LOGIN_URL = os.getenv('LOGIN_URL', '/api/token/')
    VERIFY_URL = os.getenv('VERIFY_URL', '/api/user-agreements/verify/')
    ACCESS_TOKEN_KEY = 'access_token_key'
