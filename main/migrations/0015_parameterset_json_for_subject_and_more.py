# Generated by Django 4.1.3 on 2022-11-23 23:57

import django.core.serializers.json
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_parameterset_json_for_subject_update_required_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameterset',
            name='json_for_subject',
            field=models.JSONField(blank=True, encoder=django.core.serializers.json.DjangoJSONEncoder, null=True),
        ),
        migrations.AddField(
            model_name='parametersetplayer',
            name='json_for_subject',
            field=models.JSONField(blank=True, encoder=django.core.serializers.json.DjangoJSONEncoder, null=True),
        ),
    ]