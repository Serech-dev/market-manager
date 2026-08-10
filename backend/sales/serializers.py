from django.db.models import Avg, Sum

from rest_framework import serializers

from .models import Product, Sale


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name"]


class SaleSerializer(serializers.ModelSerializer):
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        error_messages={
            "blank": "La descripción no puede estar vacía.",
            "required": "La descripción no puede estar vacía.",
        },
    )

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
        fields = "__all__"
        ordering = ["-date", "-created_at"]

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

        return attrs

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


class ProductAnalyticsSerializer(serializers.ModelSerializer):
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

    earnings = serializers.SerializerMethodField()

    average_sale = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    first_sale = serializers.DateField(read_only=True)
    last_sale = serializers.DateField(read_only=True)

    def get_earnings(self, obj):
        return obj.gross - obj.investment

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sales_count",
            "gross",
            "investment",
            "earnings",
            "average_sale",
            "first_sale",
            "last_sale",
        ]