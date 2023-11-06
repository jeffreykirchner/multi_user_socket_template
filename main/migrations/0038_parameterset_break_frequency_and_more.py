# Generated by Django 4.2.6 on 2023-10-30 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0037_parameterset_avatar_animation_speed_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameterset',
            name='break_frequency',
            field=models.IntegerField(default=7, verbose_name='Break Frequency'),
        ),
        migrations.AddField(
            model_name='parameterset',
            name='break_length',
            field=models.IntegerField(default=100, verbose_name='Break Length'),
        ),
    ]