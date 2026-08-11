from datetime import datetime
from decimal import Decimal

from django.db.models import Avg, Count, Max, Min, Q, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from .serializers import ProductAnalyticsSerializer, ProductSerializer, SaleSerializer
from .utils import apply_period_filter
from .models import Product, Sale




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
    queryset = Product.objects.all()

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()

        sales = Sale.objects.filter(product=product)
        sales = apply_period_filter(sales, request.query_params)

        analytics = {
            "id": product.id,
            "name": product.name,
            "sales_count": sales.count(),
            "gross": sales.aggregate(
                total=Coalesce(
                    Sum("gross_amount"),
                    Value(Decimal("0")),
                )
            )["total"],
            "investment": sales.aggregate(
                total=Coalesce(
                    Sum("investment_amount"),
                    Value(Decimal("0")),
                )
            )["total"],
            "average_sale": sales.aggregate(
                average=Coalesce(
                    Avg("gross_amount"),
                    Value(Decimal("0")),
                )
            )["average"],
            "first_sale": sales.order_by("date").values_list(
                "date",
                flat=True,
            ).first(),
            "last_sale": sales.order_by("-date").values_list(
                "date",
                flat=True,
            ).first(),
        }

        analytics["earnings"] = (
            analytics["gross"] - analytics["investment"]
        )

        serializer = self.get_serializer(analytics)

        return Response(serializer.data)