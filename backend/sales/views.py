from decimal import Decimal

from django.db.models import Avg, Count, F, Max, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, Sale
from .serializers import (ProductAnalyticsSerializer, ProductSerializer,
                          SaleSerializer)
from .utils import apply_period_filter


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
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.annotate(
            sales_count=Count("sales"),
            gross=Coalesce(
                Sum("sales__gross_amount"),
                Value(Decimal("0")),
            ),
            investment=Coalesce(
                Sum("sales__investment_amount"),
                Value(Decimal("0")),
            ),
            earnings=Coalesce(
                Sum("sales__gross_amount"),
                Value(Decimal("0")),
            ) - Coalesce(
                Sum("sales__investment_amount"),
                Value(Decimal("0")),
            ),
            last_sale=Max("sales__date"),
        ).filter(active=True)

        sort = self.request.query_params.get("sort", "name")

        sort_options = {
            "name": "name",
            "sales": "-sales_count",
            "gross": "-gross",
            "earnings": "-earnings",
            "recent": F("last_sale").desc(nulls_last=True),
            "oldest": "created_at",
        }

        return queryset.order_by(
            sort_options.get(sort, "name")
        )

    def create(self, request, *args, **kwargs):
        name = " ".join(
            request.data.get("name", "").strip().lower().split()
        )

        if not name:
            return Response(
                {"name": "El nombre no puede estar vacío."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing_product = Product.objects.filter(
            name=name
        ).first()

        if existing_product:
            if existing_product.active:
                return Response(
                    {"name": "El producto ya existe."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            existing_product.active = True
            existing_product.save(
                update_fields=["active"]
            )

            return Response(
                self.get_serializer(existing_product).data,
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(
            data={"name": name}
        )
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        return Response(
            self.get_serializer(product).data,
            status=status.HTTP_201_CREATED,
        )
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

class ProductArchiveView(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def perform_update(self, serializer):
        product = self.get_object()

        if product.sales.exists():
            raise ValidationError(
                "No se puede archivar un producto que tiene ventas registradas."
            )

        serializer.save(active=False)