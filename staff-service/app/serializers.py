from rest_framework import serializers
from django.contrib.auth.models import User

from .models import StaffAuthToken


class StaffUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ["id", "username", "email", "is_staff", "is_superuser"]


class StaffLoginSerializer(serializers.Serializer):
  username = serializers.CharField()
  password = serializers.CharField(write_only=True)


class StaffTokenSerializer(serializers.ModelSerializer):
  user = StaffUserSerializer()

  class Meta:
    model = StaffAuthToken
    fields = ["key", "user", "created_at"]
