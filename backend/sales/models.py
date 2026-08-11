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


class Product(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
    )

    active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def save(self, *args, **kwargs):
        self.name = " ".join(self.name.strip().lower().split())
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Sale(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="sales",
    )

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