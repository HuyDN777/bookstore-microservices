
from django.urls import path
from .views import health, register, login, me

urlpatterns = [
    path("health/", health),
    path("auth/register/", register),
    path("auth/login/", login),
    path("auth/me/", me),
]
