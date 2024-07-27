# pimp_my_english/simemaps.py

from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from quizzes.models import Quiz
from wordsets.models import WordSet


class StaticViewSitemap(Sitemap):
    """
    Sitemap class for static views.

    Attributes:
        priority (float): The priority of the URL.
        changefreq (str): How frequently the page is likely to change.
    """
    priority = 0.5
    changefreq = 'weekly'

    def items(self):
        """
        Returns a list of view names to include in the sitemap.

        Returns:
            list: List of view names.
        """
        return ['home', 'privacy_policy', 'terms_and_conditions', 'contact']

    def location(self, item):
        """
        Returns the URL for a given view name.

        Args:
            item (str): The view name.

        Returns:
            str: The URL of the view.
        """
        return reverse(item)


class QuizSitemap(Sitemap):
    """
    Sitemap class for Quiz model.

    Attributes:
        changefreq (str): How frequently the page is likely to change.
        priority (float): The priority of the URL.
    """
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        """
        Returns a queryset of all quizzes.

        Returns:
            QuerySet: QuerySet of Quiz objects.
        """
        return Quiz.objects.all()  # Assuming all quizzes are public

    def lastmod(self, obj):
        """
        Returns the last modification date for a given quiz.

        Args:
            obj (Quiz): The quiz object.

        Returns:
            datetime: The last modification date.
        """
        return obj.completed_at  # Assuming completed_at is the last modification date


class WordSetSitemap(Sitemap):
    """
    Sitemap class for WordSet model.

    Attributes:
        changefreq (str): How frequently the page is likely to change.
        priority (float): The priority of the URL.
    """
    changefreq = "daily"
    priority = 0.8

    def items(self):
        """
        Returns a queryset of all word sets.

        Returns:
            QuerySet: QuerySet of WordSet objects.
        """
        return WordSet.objects.all()  # Assuming all word sets are public

    def lastmod(self, obj):
        """
        Returns the last modification date for a given word set.

        Args:
            obj (WordSet): The word set object.

        Returns:
            datetime: The last modification date.
        """
        return obj.updated_at  # Assuming updated_at is the last modification date
