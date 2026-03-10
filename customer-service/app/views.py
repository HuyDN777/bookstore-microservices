
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    TokenSerializer,
    UserSerializer,
)
from .models import AuthToken


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = AuthToken.create_for_user(user)
        return Response(TokenSerializer(token).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=serializer.validated_data["username"],
        password=serializer.validated_data["password"],
    )
    if not user:
        return Response(
            {"detail": "Sai username hoặc password."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    token = AuthToken.create_for_user(user)
    return Response(TokenSerializer(token).data)


@api_view(["GET"])
def me(request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Token "):
        return Response({"detail": "Thiếu Authorization header."}, status=status.HTTP_401_UNAUTHORIZED)
    key = auth_header.split(" ", 1)[1]
    try:
        token = AuthToken.objects.select_related("user").get(key=key)
    except AuthToken.DoesNotExist:
        return Response({"detail": "Token không hợp lệ."}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(UserSerializer(token.user).data)

