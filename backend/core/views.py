from django.http import JsonResponse
from rest_framework import status


def error404(request, exception):
        return JsonResponse({
        'error': 'Not Found.',
    }, status=status.HTTP_404_NOT_FOUND)