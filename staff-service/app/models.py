from django.db import models
from django.contrib.auth.models import User
import secrets


class StaffAuthToken(models.Model):
    key = models.CharField(max_length=40, unique=True)
    user = models.ForeignKey(User, related_name="staff_tokens", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def create_for_user(user: User) -> "StaffAuthToken":
        token = secrets.token_hex(20)
        return StaffAuthToken.objects.create(user=user, key=token)

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.user.username}:{self.key}"
