from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    transaction_type = models.CharField(
        max_length=20,
        choices=[
            ("income", "Income"),
            ("expense", "Expense"),
        ]
    )

    def __str__(self):
        return self.name


class Transaction(models.Model):
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT
    )
    description = models.CharField(
        max_length=255,
        blank=True
    )
    date = models.DateField()
    created_at = models.DateTimeField(
        auto_now_add=True
    )