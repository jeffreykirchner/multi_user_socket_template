# Generated by Django 4.2.16 on 2024-12-18 18:02

from django.db import migrations
from main.models import Profile
from django.contrib.auth.models import User

def create_profile(apps, schema_editor):

    for user in User.objects.filter(profile=None):
        Profile.objects.create(user=user)


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0063_profile'),
    ]

    operations = [
        migrations.RunPython(create_profile),
    ]