import uuid


def is_valid_uuid(value):
    """Check if a value is a valid UUID."""
    try:
        uuid.UUID(str(value))
        return True
    except ValueError:
        return False
