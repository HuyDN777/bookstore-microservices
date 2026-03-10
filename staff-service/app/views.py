
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate

from .serializers import StaffLoginSerializer, StaffTokenSerializer, StaffUserSerializer
from .models import StaffAuthToken


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["POST"])
def staff_login(request):
    serializer = StaffLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=serializer.validated_data["username"],
        password=serializer.validated_data["password"],
    )
    if not user or not user.is_staff:
        return Response(
            {"detail": "Tài khoản không phải nhân viên hoặc thông tin đăng nhập sai."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    token = StaffAuthToken.create_for_user(user)
    return Response(StaffTokenSerializer(token).data)


@api_view(["GET"])
def staff_me(request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Token "):
        return Response({"detail": "Thiếu Authorization header."}, status=status.HTTP_401_UNAUTHORIZED)
    key = auth_header.split(" ", 1)[1]
    try:
        token = StaffAuthToken.objects.select_related("user").get(key=key)
    except StaffAuthToken.DoesNotExist:
        return Response({"detail": "Token không hợp lệ."}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(StaffUserSerializer(token.user).data)

