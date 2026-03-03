
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Order
from .serializers import OrderSerializer


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET", "POST"])
def orders(request):
    if request.method == "GET":
        queryset = Order.objects.prefetch_related("items").all()
        serializer = OrderSerializer(queryset, many=True)
        return Response(serializer.data)

    # POST: create new order with nested items
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def order_detail(request, pk: int):
    try:
        order = Order.objects.prefetch_related("items").get(pk=pk)
    except Order.DoesNotExist:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = OrderSerializer(order)
    return Response(serializer.data)
