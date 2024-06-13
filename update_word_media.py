import os
import django

# Ensure Django settings are configured
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pimp_my_english.settings')

django.setup()

from django.conf import settings
from wordsets.models import Word

# Base paths
base_image_path = os.path.join(settings.BASE_DIR, 'static/images/quiz_images')
base_audio_path = os.path.join(settings.BASE_DIR, 'static/sound')

# Get all words from the database
words = Word.objects.all()

# Update each word with image and audio data
for word in words:
    image_path = os.path.join(base_image_path, f"{word.text.lower()}.webp")
    audio_path = os.path.join(base_audio_path, f"{word.text.lower()}.mp3")

    # Update image data if the file exists
    if os.path.exists(image_path):
        with open(image_path, 'rb') as img_file:
            word.image_data = img_file.read()
        print(f"Updated image data for word: {word.text}")

    # Update audio data if the file exists
    if os.path.exists(audio_path):
        with open(audio_path, 'rb') as audio_file:
            word.audio_data = audio_file.read()
        print(f"Updated audio data for word: {word.text}")

    # Save changes to the word instance
    word.save()

print("Media data update completed.")
