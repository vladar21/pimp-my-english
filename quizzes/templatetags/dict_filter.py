# quizzes/templatetags/dict_filter.py
from django import template

register = template.Library()

@register.filter
def dict(d, key):
    return d[key]