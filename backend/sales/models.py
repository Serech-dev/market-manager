from django.db import models


class Category(models.Model):
    TRANSACTION_TYPES = [
        ("income", "Income"),
        ("expense", "Expense"),
    ]

    name = models.CharField(max_length=100)
    transaction_type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPES,
    )

    def __str__(self):
        return self.name


class Sale(models.Model):
    gross_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    investment_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    description = models.CharField(
        max_length=255,
    )

    date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-date", "-created_at"]

    @property
    def earnings(self):
        return self.gross_amount - self.investment_amount

    def __str__(self):
        return f"{self.description} - ${self.gross_amount}"