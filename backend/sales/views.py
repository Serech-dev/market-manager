from datetime import datetime

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
        sales = Sale.objects.all()

        date = request.query_params.get("date")
        month = request.query_params.get("month")

        if date:
            sales = sales.filter(date=date)

        elif month:
            year, month_num = month.split("-")
            sales = sales.filter(
                date__year=int(year),
                date__month=int(month_num),
            )

        else:
            date = datetime.now()

        gross = sales.aggregate(
            total=Sum("gross_amount")
        )["total"] or 0

        investment = sales.aggregate(
            total=Sum("investment_amount")
        )["total"] or 0

        earnings = gross - investment

        return Response({
            "gross": gross,
            "investment": investment,
            "earnings": earnings,
        })