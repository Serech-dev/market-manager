from decimal import Decimal

from django.db.models import Avg, Count, F, Max, Q, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, ProductCategory, Sale
from .serializers import (ProductAnalyticsSerializer,
                          ProductCategoryAnalyticsSerializer,
                          ProductCategorySerializer, ProductSerializer,
                          SaleSerializer)
from .utils import apply_period_filter


class SaleListCreateView(generics.ListCreateAPIView):
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Sale.objects.filter(
            product__user=self.request.user,
        )

        return apply_period_filter(
            queryset,
            self.request.query_params,
        )

    
class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Sale.objects.filter(
            product__user=self.request.user,
        )


class SaleSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        sales = apply_period_filter(
            Sale.objects.filter(
                product__user=request.user,
            ),
            request.query_params,
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


class ProductCategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ProductCategory.objects.filter(
            user=self.request.user,
        )

        sales = Sale.objects.filter(
            product__category__user=self.request.user,
        )

        sales = apply_period_filter(
            sales,
            self.request.query_params,
        )

        sales_filter = Q(
            products__sales__in=sales,
        )

        queryset = queryset.annotate(
            products_count=Count(
                "products",
                distinct=True,
            ),
            sales_count=Count(
                "products__sales",
                filter=sales_filter,
            ),
            gross=Coalesce(
                Sum(
                    "products__sales__gross_amount",
                    filter=sales_filter,
                ),
                Value(Decimal("0")),
            ),
            investment=Coalesce(
                Sum(
                    "products__sales__investment_amount",
                    filter=sales_filter,
                ),
                Value(Decimal("0")),
            ),
            earnings=Coalesce(
                Sum(
                    "products__sales__gross_amount",
                    filter=sales_filter,
                ),
                Value(Decimal("0")),
            ) - Coalesce(
                Sum(
                    "products__sales__investment_amount",
                    filter=sales_filter,
                ),
                Value(Decimal("0")),
            ),
            last_sale=Max(
                "products__sales__date",
                filter=sales_filter,
            ),
        )

        sort = self.request.query_params.get(
            "sort",
            "name",
        )

        sort_options = {
            "name": "name",
            "products": "-products_count",
            "sales": "-sales_count",
            "gross": "-gross",
            "earnings": "-earnings",
            "recent": F("last_sale").desc(
                nulls_last=True,
            ),
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

        existing_category = ProductCategory.objects.filter(
            user=request.user,
            name=name,
        ).first()

        if existing_category:
            return Response(
                {"name": "La categoría ya existe."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(
            data={"name": name}
        )

        serializer.is_valid(raise_exception=True)

        category = serializer.save(
            user=request.user
        )

        return Response(
            self.get_serializer(category).data,
            status=status.HTTP_201_CREATED,
        )


class ProductListView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Product.objects.filter(
            user=self.request.user,
        ).annotate(
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
            user=request.user,
            name=name,
        ).first()

        if existing_product:
            if existing_product.active:
                return Response(
                    {"name": "El producto ya existe."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            existing_product.active = True
            existing_product.category_id = request.data.get("category") or None
            existing_product.save(
                update_fields=["active", "category"]
            )

            return Response(
                self.get_serializer(existing_product).data,
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(
            data={
                "name": name,
                "category": request.data.get("category") or None,
            }
        )

        serializer.is_valid(raise_exception=True)

        product = serializer.save(
            user=request.user,
        )

        return Response(
            self.get_serializer(product).data,
            status=status.HTTP_201_CREATED,
        )

    
class ProductAnalyticsView(generics.RetrieveUpdateAPIView):
    serializer_class = ProductAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(
            user=self.request.user,
        )

    def get_analytics(self, product, request):
        sales = Sale.objects.filter(product=product)
        sales = apply_period_filter(sales, request.query_params)

        analytics = {
            "id": product.id,
            "name": product.name,
            "category": product.category_id,
            "category_name": (
                product.category.name
                if product.category
                else None
            ),
            "price": product.price,
            "investment_price": product.investment_price,
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

        return analytics

    def update(self, request, *args, **kwargs):
        product = self.get_object()

        name = request.data.get("name")

        if name is not None:
            name = " ".join(
                name.strip().lower().split()
            )

            if not name:
                return Response(
                    {"name": "El nombre no puede estar vacío."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            existing_product = Product.objects.filter(
                user=request.user,
                name=name,
            ).exclude(
                pk=product.pk,
            ).first()

            if existing_product:
                return Response(
                    {"name": "El producto ya existe."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = ProductSerializer(
            product,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        analytics = self.get_analytics(product, request)

        return Response(
            self.get_serializer(analytics).data
        )

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()

        analytics = self.get_analytics(product, request)

        serializer = self.get_serializer(analytics)

        return Response(serializer.data)


class ProductArchiveView(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(
            user=self.request.user,
        )

    def perform_update(self, serializer):
        product = self.get_object()

        if product.sales.exists():
            raise ValidationError(
                "No se puede archivar un producto que tiene ventas registradas."
            )

        serializer.save(active=False)


class ProductCategoryAnalyticsView(generics.RetrieveAPIView):
    serializer_class = ProductCategoryAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductCategory.objects.filter(
            user=self.request.user,
        )

    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()

        sales = Sale.objects.filter(
            product__category=category,
        )
        sales = apply_period_filter(sales, request.query_params)

        analytics = {
            "id": category.id,
            "name": category.name,
            "products_count": category.products.count(),
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