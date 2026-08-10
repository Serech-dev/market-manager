from rest_framework import serializers

from .models import Sale


class SaleSerializer(serializers.ModelSerializer):
    description = serializers.CharField(
        error_messages={
            "blank": "La descripción no puede estar vacía.",
            "required": "La descripción no puede estar vacía.",
        }
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
        if attrs["investment_amount"] > attrs["gross_amount"]:
            raise serializers.ValidationError({
                "investment_amount": (
                    "El monto invertido no puede ser mayor "
                    "al ingreso bruto."
                )
            })

        return attrs