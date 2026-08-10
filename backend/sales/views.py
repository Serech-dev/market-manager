from django.db.models import Avg, Count, Max, Min, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from .serializers import ProductAnalyticsSerializer, ProductSerializer, SaleSerializer
from .utils import apply_period_filter
from .models import Product, Sale

from decimal import Decimal


class SaleListCreateView(generics.ListCreateAPIView):
    serializer_class = SaleSerializer

    def get_queryset(self):
        queryset = Sale.objects.all()

        return apply_period_filter(
            queryset,
            self.request.query_params
        )

class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class SaleSummaryView(APIView):
    def get(self, request):
        sales = apply_period_filter(
            Sale.objects.all(),
            request.query_params
        )

        totals = sales.aggregate(
            gross=Sum("gross_amount"),
            investment=Sum("investment_amount"),
        )

        gross = totals["gross"] or 0
        investment = totals["investment"] or 0

        return Response({
            "gross": gross,
            "investment": investment,
            "earnings": gross - investment,
        })

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by("name")
    serializer_class = ProductSerializer

class ProductAnalyticsView(generics.RetrieveAPIView):
    serializer_class = ProductAnalyticsSerializer

    def get_queryset(self):
        return Product.objects.annotate(
            sales_count=Count("sales"),
            gross=Coalesce(
                Sum("sales__gross_amount"),
                Value(Decimal("0")),
            ),
            investment=Coalesce(
                Sum("sales__investment_amount"),
                Value(Decimal("0")),
            ),
            average_sale=Coalesce(
                Avg("sales__gross_amount"),
                Value(Decimal("0")),
            ),
            first_sale=Min("sales__date"),
            last_sale=Max("sales__date"),
        )