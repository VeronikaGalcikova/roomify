# Generated by Django 5.1.3 on 2024-12-05 10:03

import card.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('card', '0002_remove_card_allowed'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='expiration_date',
            field=models.DateTimeField(default=card.models.default_expiration),
        ),
    ]
