# Generated by Django 5.0.6 on 2024-06-13 00:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wordsets', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='word',
            name='word_set',
        ),
    ]