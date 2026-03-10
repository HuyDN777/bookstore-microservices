
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import requests

from .models import Order
from .serializers import OrderSerializer


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET", "POST"])
def orders(request):
    if request.method == "GET":
        customer_username = request.query_params.get("customer_username")
        queryset = Order.objects.prefetch_related("items").all()
        if customer_username:
            queryset = queryset.filter(customer_username=customer_username)
        serializer = OrderSerializer(queryset, many=True)
        return Response(serializer.data)

    # POST: create new order with nested items
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PATCH"])
def order_detail(request, pk: int):
    try:
        order = Order.objects.prefetch_related("items").get(pk=pk)
    except Order.DoesNotExist:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    # PATCH: update status (admin use) - require staff token
    if not _is_staff_request(request):
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    status_value = request.data.get("status")
    if status_value not in ["pending", "processing", "shipped", "completed", "cancelled"]:
        return Response(
            {"detail": "Invalid status."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    order.status = status_value
    order.save(update_fields=["status"])
    return Response(OrderSerializer(order).data)


def _is_staff_request(request) -> bool:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Token "):
        return False
    try:
        resp = requests.get(
            "http://staff-service:8000/auth/me/",
            headers={"Authorization": auth_header},
            timeout=3,
        )
        if resp.status_code != 200:
            return False
        data = resp.json()
        return bool(data.get("is_staff") or data.get("is_superuser"))
    except Exception:
        return False
