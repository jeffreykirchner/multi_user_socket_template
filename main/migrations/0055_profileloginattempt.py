# Generated by Django 4.2.11 on 2024-05-08 20:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0054_remove_parameterset_instruction_set_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfileLoginAttempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('success', models.BooleanField(default=False, verbose_name='Login Success')),
                ('note', models.TextField(blank=True, null=True, verbose_name='Note')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('my_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='profile_login_attempts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Profile Login Attempt',
                'verbose_name_plural': 'Profile Login Attempts',
                'ordering': ['timestamp'],
            },
        ),
    ]
