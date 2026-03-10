from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "book_title", "unit_price", "quantity"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer_name",
            "customer_email",
            "customer_username",
            "status",
            "total_price",
            "created_at",
            "items",
        ]
        read_only_fields = ["total_price", "created_at"]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        total = 0
        for item in items_data:
            total += item["unit_price"] * item["quantity"]
        order = Order.objects.create(total_price=total, **validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order