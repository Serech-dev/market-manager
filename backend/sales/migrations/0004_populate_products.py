from django.db import migrations


def create_products(apps, schema_editor):
    Product = apps.get_model("sales", "Product")
    Sale = apps.get_model("sales", "Sale")

    product_cache = {}

    for sale in Sale.objects.all():
        name = sale.description.strip()

        if not name:
            continue

        if name not in product_cache:
            product, _ = Product.objects.get_or_create(
                name=name
            )
            product_cache[name] = product

        sale.product = product_cache[name]
        sale.save(update_fields=["product"])


def reverse_products(apps, schema_editor):
    Sale = apps.get_model("sales", "Sale")

    for sale in Sale.objects.select_related("product"):
        if sale.product:
            sale.description = sale.product.name
            sale.save(update_fields=["description"])

        sale.product = None
        sale.save(update_fields=["product"])


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0003_product_sale_product"),
    ]

    operations = [
        migrations.RunPython(
            create_products,
            reverse_products,
        ),
    ]