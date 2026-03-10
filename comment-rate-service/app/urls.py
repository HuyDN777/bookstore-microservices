
from django.urls import path
from .views import health, reviews

urlpatterns = [
    path("health/", health),
    path("reviews/", reviews),
]
