
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Review
from .serializers import ReviewSerializer


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET", "POST"])
def reviews(request):
    book_id = request.query_params.get("book_id")
    if request.method == "GET":
        queryset = Review.objects.all()
        if book_id is not None:
            queryset = queryset.filter(book_id=book_id)
        serializer = ReviewSerializer(queryset, many=True)
        return Response(serializer.data)

    # POST
    data = request.data.copy()
    if "book_id" not in data and book_id is not None:
        data["book_id"] = book_id
    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
