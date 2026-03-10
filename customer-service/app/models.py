from django.db import models
from django.contrib.auth.models import User
import secrets


class AuthToken(models.Model):
    """
    Simple token model for API authentication.

    Token được tạo khi user đăng nhập, FE sẽ gửi Authorization: Token <key>
    cho các API cần bảo vệ (về sau bạn có thể dùng lại hoặc thay bằng JWT).
    """

    key = models.CharField(max_length=40, unique=True)
    user = models.ForeignKey(User, related_name="auth_tokens", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def create_for_user(user: User) -> "AuthToken":
        token = secrets.token_hex(20)
        return AuthToken.objects.create(user=user, key=token)

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.user.username}:{self.key}"
