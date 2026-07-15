from rest_framework import serializers

from .models import Category, Sale


class SaleSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    earnings = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Sale
        fields = [
            "id",
            "gross_amount",
            "investment_amount",
            "earnings",
            "description",
            "date",
            "created_at",
        ]