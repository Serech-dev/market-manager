from django.db import migrations


def create_categories(apps, schema_editor):
    Category = apps.get_model("finances", "Category")

    Category.objects.bulk_create([
        Category(name="Sales", transaction_type="income"),
        Category(name="Materials", transaction_type="expense"),
        Category(name="Transport", transaction_type="expense"),
        Category(name="Personal", transaction_type="expense"),
    ])


class Migration(migrations.Migration):

    dependencies = [
        ("finances", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_categories),
    ]