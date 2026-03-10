
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import requests

from .models import Book
from .serializers import BookSerializer


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET", "POST"])
def book_list(request):
    """
    List all books or create a new one.
    """
    if request.method == "GET":
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    # Only staff can create books
    if not _is_staff_request(request):
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        book = serializer.save()
        return Response(BookSerializer(book).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def book_detail(request, pk: int):
    """
    Retrieve, update or delete a single book.
    """
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = BookSerializer(book)
        return Response(serializer.data)

    # staff-only for update/delete
    if not _is_staff_request(request):
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method in ["PUT", "PATCH"]:
        serializer = BookSerializer(book, data=request.data, partial=request.method == "PATCH")
        if serializer.is_valid():
            book = serializer.save()
            return Response(BookSerializer(book).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    book.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


def _is_staff_request(request) -> bool:
    """
    Xác thực nhanh bằng cách gọi staff-service /auth/me với header Authorization hiện tại.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Token "):
        return False
    try:
        resp = requests.get(
            "http://staff-service:8000/auth/me/",
            headers={"Authorization": auth_header},
            timeout=3,
        )
        if resp.status_code != 200:
            return False
        data = resp.json()
        return bool(data.get("is_staff") or data.get("is_superuser"))
    except Exception:
        return False
