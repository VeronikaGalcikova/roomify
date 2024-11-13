from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'room-readers', views.RoomReaderViewSet)
router.register(r'user-agreements', views.UserAgreementViewSet)
router.register(r'room-entry-logs', views.RoomEntryLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]