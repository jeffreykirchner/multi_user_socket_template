# Generated by Django 4.2.10 on 2024-02-26 19:46

import django.core.serializers.json
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0048_parametersetbarrier_parameter_set_players'),
    ]

    operations = [
        migrations.AddField(
            model_name='sessionperiod',
            name='summary_data',
            field=models.JSONField(blank=True, encoder=django.core.serializers.json.DjangoJSONEncoder, null=True, verbose_name='Summary Data'),
        ),
    ]
