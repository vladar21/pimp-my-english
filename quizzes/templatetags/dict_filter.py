# quizzes/templatetags/dict_filter.py

from django import template

register = template.Library()


@register.filter
def dict(d, key):
    """
    Custom template filter to access dictionary values by key in Django templates.

    Args:
        d (dict): The dictionary to access.
        key: The key to look up in the dictionary.

    Returns:
        The value corresponding to the given key in the dictionary.
    """
    return d[key]
