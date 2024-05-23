from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='landing.html'), name='landing'),
    # path('accounts/', include('accounts.urls')),
    # path('subscriptions/', include('subscriptions.urls')),
    # path('wordsets/', include('wordsets.urls')),
    # path('quizzes/', include('quizzes.urls')),
    # path('admin_app/', include('admin_app.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)