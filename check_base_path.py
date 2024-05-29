import os
import django
from django.conf import settings

# Ensure Django settings are configured
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pimp_my_english.settings')
django.setup()

# Base paths
base_image_path = os.path.join(settings.BASE_DIR, 'static/images/quiz_images')
base_audio_path = os.path.join(settings.BASE_DIR, 'static/sound')

# Word files to check
word_files = {
    'humanity': {
        'image': 'humanity.webp',
        'audio': 'humanity.mp3',
    },
    'charisma': {
        'image': 'charisma.webp',
        'audio': 'charisma.mp3',
    },
    # Add all your words here
}


def check_files(base_image_path, base_audio_path, word_files):
    print(f"Base Image Path: {base_image_path}")
    print(f"Base Audio Path: {base_audio_path}")
    print("=" * 30)

    for word, files in word_files.items():
        image_path = os.path.join(base_image_path, files['image'])
        audio_path = os.path.join(base_audio_path, files['audio'])

        print(f"Checking files for word: {word}")
        print(f"Expected Image Path: {image_path}")
        print(f"Expected Audio Path: {audio_path}")

        image_exists = os.path.exists(image_path)
        audio_exists = os.path.exists(audio_path)

        print(f"Image Exists: {image_exists}")
        print(f"Audio Exists: {audio_exists}")
        print("=" * 30)


check_files(base_image_path, base_audio_path, word_files)
