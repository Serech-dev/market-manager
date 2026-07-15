from rest_framework import serializers

from .models import Category, Sale


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class SaleSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )

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
            "category",
            "category_id",
        ]