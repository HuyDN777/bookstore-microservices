
from django.urls import path
from .views import health, recommend

urlpatterns = [
    path("health/", health),
    path("recommend/", recommend),
]
