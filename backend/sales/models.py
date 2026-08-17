from django.contrib.auth.models import User
from django.db import models


class ProductCategory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="product_categories",
    )

    name = models.CharField(
        max_length=100,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_product_category_per_user",
            )
        ]

    def __str__(self):
        return self.name


class Product(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="products",
    )
    name = models.CharField(
        max_length=255,
    )
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    investment_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    active = models.BooleanField(
        default=True,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_product_per_user",
            )
        ]

    def save(self, *args, **kwargs):
        self.name = " ".join(
            self.name.strip().lower().split()
        )
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

    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["-date", "-created_at"]

    @property
    def earnings(self):
        return self.gross_amount - self.investment_amount

    def __str__(self):
        return f"{self.description} - ${self.gross_amount}"