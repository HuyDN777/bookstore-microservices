
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import requests


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET"])
def recommend(request):
    """
    Gợi ý sách rất đơn giản: lấy danh sách sách từ book-service,
    loại bỏ sách hiện tại (nếu có book_id) và trả về tối đa 3 cuốn mới nhất.
    """
    book_id = request.query_params.get("book_id")
    try:
        resp = requests.get("http://book-service:8000/books/", timeout=3)
        resp.raise_for_status()
    except Exception as exc:  # pragma: no cover - network errors
        return Response(
            {"detail": f"Không gọi được book-service: {exc}"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    books = resp.json()
    if not isinstance(books, list):
        return Response(
            {"detail": "book-service trả dữ liệu không đúng định dạng."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    if book_id is not None:
        try:
            numeric_id = int(book_id)
        except ValueError:
            numeric_id = None
        if numeric_id is not None:
            books = [b for b in books if b.get("id") != numeric_id]

    # Lấy tối đa 3 cuốn đầu tiên (book-service đã sort theo created_at desc)
    suggested = books[:3]
    return Response(suggested)
