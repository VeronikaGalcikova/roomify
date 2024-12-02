from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsSuperUserOnly(BasePermission):
    """Allow access only to superusers for all operations."""
    message = "You must be a superuser to perform this action."

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsSuperUserOrReadOnly(BasePermission):
    """Allow safe (read-only) methods for all authenticated users and write operations for superusers only."""
    message = "You must be a superuser to perform this action."

    def has_permission(self, request, view):
        # Allow safe methods for authenticated users
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # Allow other methods only for superusers
        return request.user and request.user.is_superuser
