from rest_framework import serializers

from .models import Category, Sale


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = "__all__"

    def validate(self, attrs):
        if attrs["investment_amount"] > attrs["gross_amount"]:
            raise serializers.ValidationError({
                "investment_amount": "El monto invertido no puede ser mayor al ingreso bruto."
            })

        return attrs