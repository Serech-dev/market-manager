from django.db.models import Sum
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Sale
from .serializers import SaleSerializer


class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class SaleSummaryView(APIView):
    def get(self, request):
        gross = (
            Sale.objects.aggregate(
                total=Sum("gross_amount")
            )["total"]
            or 0
        )

        investment = (
            Sale.objects.aggregate(
                total=Sum("investment_amount")
            )["total"]
            or 0
        )

        earnings = gross - investment

        return Response(
            {
                "gross": gross,
                "investment": investment,
                "earnings": earnings,
            }
        )