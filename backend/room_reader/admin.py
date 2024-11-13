from django.contrib import admin

from room_reader.models import RoomReader, UserAgreement, RoomEntryLog

admin.site.register(RoomReader)
admin.site.register(UserAgreement)
admin.site.register(RoomEntryLog)
