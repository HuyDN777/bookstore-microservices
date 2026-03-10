
from django.urls import path
from .views import health, staff_login, staff_me

urlpatterns = [
    path("health/", health),
    path("auth/login/", staff_login),
    path("auth/me/", staff_me),
]
