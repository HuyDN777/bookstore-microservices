from rest_framework import serializers
from django.contrib.auth.models import User

from .models import AuthToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=4)

    def create(self, validated_data):
        username = validated_data["username"]
        email = validated_data.get("email", "")
        password = validated_data["password"]
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "Username đã tồn tại."})
        user = User.objects.create_user(username=username, email=email, password=password)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class TokenSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = AuthToken
        fields = ["key", "user", "created_at"]
