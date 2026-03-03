
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Book
from .serializers import BookSerializer


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET"])
def book_list(request):
    """
    Simple list endpoint returning all books.
    """
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def book_detail(request, pk: int):
    """
    Get a single book by id.
    """
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = BookSerializer(book)
    return Response(serializer.data)
