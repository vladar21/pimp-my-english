# Generated by Django 5.0.6 on 2024-05-23 00:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('admin_app', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Word',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=255)),
                ('language_code', models.CharField(choices=[('en', 'English'), ('ru', 'Russian'), ('ua', 'Ukrainian')], max_length=2)),
                ('country_code', models.CharField(choices=[('US', 'United States'), ('UK', 'United Kingdom'), ('RU', 'Russia'), ('UA', 'Ukraine')], max_length=2)),
                ('word_type', models.CharField(choices=[('noun', 'Noun'), ('verb', 'Verb'), ('adjective', 'Adjective'), ('adverb', 'Adverb'), ('pronoun', 'Pronoun'), ('preposition', 'Preposition'), ('conjunction', 'Conjunction'), ('interjection', 'Interjection')], max_length=20)),
                ('cefr_level', models.CharField(choices=[('A1', 'A1'), ('A2', 'A2'), ('B1', 'B1'), ('B2', 'B2'), ('C1', 'C1'), ('C2', 'C2')], max_length=2)),
                ('audio_data', models.BinaryField(blank=True, null=True)),
                ('image_data', models.BinaryField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Word',
                'verbose_name_plural': 'Words',
            },
        ),
        migrations.CreateModel(
            name='Definition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('definition', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('word', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wordsets.word')),
            ],
            options={
                'verbose_name': 'Definition',
                'verbose_name_plural': 'Definitions',
            },
        ),
        migrations.CreateModel(
            name='WordSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('rating', models.FloatField()),
                ('author_username', models.CharField(max_length=255)),
                ('author_email', models.EmailField(max_length=254)),
                ('approved_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='admin_app.admin')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_wordsets', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Word Set',
                'verbose_name_plural': 'Word Sets',
            },
        ),
        migrations.CreateModel(
            name='WordInSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wordsets.word')),
                ('word_set', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wordsets.wordset')),
            ],
            options={
                'verbose_name': 'Word in Set',
                'verbose_name_plural': 'Words in Sets',
            },
        ),
        migrations.AddField(
            model_name='word',
            name='word_set',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='words', to='wordsets.wordset'),
        ),
    ]
