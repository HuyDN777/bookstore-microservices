
from django.urls import path
from .views import health, orders, order_detail

urlpatterns = [
    path("health/", health),
    path("orders/", orders),
    path("orders/<int:pk>/", order_detail),
]
