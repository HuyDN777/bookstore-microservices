from django.db import models


class Review(models.Model):
    book_id = models.IntegerField(help_text="ID của sách trong book-service")
    username = models.CharField(max_length=150, blank=True)
    rating = models.PositiveSmallIntegerField(default=5)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover
        return f"Review for book {self.book_id} by {self.username or 'anonymous'}"

