# Generated by Django 4.2.11 on 2024-05-07 17:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0053_alter_parametersetplayer_hex_color'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='parameterset',
            name='instruction_set',
        ),
        migrations.AddField(
            model_name='parametersetplayer',
            name='instruction_set',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='parameter_set_players_c', to='main.instructionset'),
        ),
    ]
