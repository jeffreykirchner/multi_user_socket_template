# Generated by Django 4.2 on 2023-05-30 20:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0029_remove_session_current_experiment_phase'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='session',
            name='finished',
        ),
    ]
