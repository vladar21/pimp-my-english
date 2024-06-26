# Generated by Django 5.0.6 on 2024-06-13 23:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wordsets', '0002_remove_word_word_set'),
    ]

    operations = [
        migrations.AddField(
            model_name='wordset',
            name='words',
            field=models.ManyToManyField(related_name='word_sets', to='wordsets.word'),
        ),
        migrations.DeleteModel(
            name='WordInSet',
        ),
    ]
