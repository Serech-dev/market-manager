from django.db import migrations


def rename_categories(apps, schema_editor):
    Category = apps.get_model("finances", "Category")

    Category.objects.filter(name="Sales").update(name="Ventas")
    Category.objects.filter(name="Materials").update(name="Materiales")
    Category.objects.filter(name="Materials").update(name="Transporte")
    Category.objects.filter(name="Materials").update(name="Personal")


class Migration(migrations.Migration):

    dependencies = [
        ('finances', '0002_create-category'),
    ]

    operations = [
        migrations.RunPython(rename_categories),
    ]
