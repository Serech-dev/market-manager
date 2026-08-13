from django.db.models import Avg, Sum
from rest_framework import serializers

from .models import Product, Sale


class ProductSerializer(serializers.ModelSerializer):
    sales_count = serializers.IntegerField(read_only=True)
    gross = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )
    investment = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )
    earnings = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )
    last_sale = serializers.DateField(
        allow_null=True,
        read_only=True,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sales_count",
            "gross",
            "investment",
            "earnings",
            "last_sale",
        ]
        read_only_fields = ["active"]


class SaleSerializer(serializers.ModelSerializer):
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        error_messages={
            "blank": "La descripción no puede estar vacía.",
            "required": "La descripción no puede estar vacía.",
        },
    )

    unit_price = serializers.SerializerMethodField(read_only=True)

    gross_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        error_messages={
            "required": "El ingreso bruto no puede estar vacío.",
            "invalid": "El ingreso bruto no puede estar vacío.",
        },
    )

    investment_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        error_messages={
            "required": "La inversión no puede estar vacía.",
            "invalid": "La inversión no puede estar vacía.",
        },
    )

    class Meta:
        model = Sale
        fields = [
                    "id",
                    "product",
                    "gross_amount",
                    "investment_amount",
                    "description",
                    "date",
                    "created_at",
                    "quantity",
                    "unit_price",
                ]
        ordering = ["-date", "-created_at"]

        read_only_fields = [
            "id",
            "created_at",
            "unit_price",
        ]

    def validate(self, attrs):
        product = attrs.get("product")
        description = attrs.get("description", "").strip()

        if not product and not description:
            raise serializers.ValidationError({
                "product": "Selecciona un producto o ingresa uno nuevo."
            })

        if attrs["investment_amount"] > attrs["gross_amount"]:
            raise serializers.ValidationError({
                "investment_amount": (
                    "El monto invertido no puede ser mayor "
                    "al ingreso bruto."
                )
            })

        if attrs.get("quantity", 1) < 1:
            raise serializers.ValidationError({
                "quantity": "La cantidad debe ser mayor a 0."
            })

        return attrs

    def get_unit_price(self, obj):
        return obj.gross_amount / obj.quantity

    def create(self, validated_data):
        product = validated_data.get("product")
        description = validated_data.pop("description", "").strip()

        if product is None:
            normalized_name = " ".join(
                description.lower().split()
            )

            product, _ = Product.objects.get_or_create(
                name=normalized_name
            )

        validated_data["product"] = product
        validated_data["description"] = product.name

        return Sale.objects.create(**validated_data)


class ProductAnalyticsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    sales_count = serializers.IntegerField()
    gross = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    investment = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    earnings = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    average_sale = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    first_sale = serializers.DateField(
        allow_null=True,
    )
    last_sale = serializers.DateField(
        allow_null=True,
    )