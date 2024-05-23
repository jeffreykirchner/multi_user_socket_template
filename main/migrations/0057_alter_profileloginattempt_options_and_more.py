# Generated by Django 4.2.11 on 2024-05-23 18:11

import django.core.serializers.json
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0056_rename_my_profile_profileloginattempt_user'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='profileloginattempt',
            options={'ordering': ['-timestamp'], 'verbose_name': 'Profile Login Attempt', 'verbose_name_plural': 'Profile Login Attempts'},
        ),
        migrations.AddField(
            model_name='session',
            name='replay_data',
            field=models.JSONField(blank=True, encoder=django.core.serializers.json.DjangoJSONEncoder, null=True, verbose_name='Replay Data'),
        ),
    ]
