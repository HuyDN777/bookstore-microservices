
from django.urls import path
from .views import health, book_list, book_detail

urlpatterns = [
    path("health/", health),
    path("books/", book_list),
    path("books/<int:pk>/", book_detail),
]
