from datetime import datetime

from rest_framework.exceptions import ValidationError


def apply_period_filter(queryset, params):
    date = params.get("date")
    month = params.get("month")
    date_from = params.get("date_from")
    date_to = params.get("date_to")
    product = params.get("product")

    if date and month:
        raise ValidationError(
            "Usa fecha o mes, no ambos."
        )

    if date and (date_from or date_to):
        raise ValidationError(
            "Usa una fecha específica o un período."
        )

    if month and (date_from or date_to):
        raise ValidationError(
            "Usa un mes o un período."
        )

    if date:
        try:
            parsed_date = datetime.strptime(
                date,
                "%Y-%m-%d"
            ).date()
        except ValueError:
            raise ValidationError(
                "Formato de fecha inválido. Usa YYYY-MM-DD."
            )

        queryset = queryset.filter(date=parsed_date)

    elif month:
        try:
            year, month_num = month.split("-")
            year = int(year)
            month_num = int(month_num)

        except ValueError:
            raise ValidationError(
                "Formato de mes inválido. Usa YYYY-MM."
            )

        queryset = queryset.filter(
            date__year=year,
            date__month=month_num,
        )

    elif date_from or date_to:
        if not date_from or not date_to:
            raise ValidationError(
                "Debes indicar fecha de inicio y fecha de fin."
            )

        try:
            parsed_from = datetime.strptime(
                date_from,
                "%Y-%m-%d"
            ).date()

            parsed_to = datetime.strptime(
                date_to,
                "%Y-%m-%d"
            ).date()

        except ValueError:
            raise ValidationError(
                "Formato de fecha inválido. Usa YYYY-MM-DD."
            )

        if parsed_from > parsed_to:
            raise ValidationError(
                "La fecha de inicio no puede ser posterior a la fecha de fin."
            )

        queryset = queryset.filter(
            date__range=(parsed_from, parsed_to)
        )

    elif not product:
        queryset = queryset.filter(
            date=datetime.now().date()
        )

    if product:
        try:
            product = int(product)
        except ValueError:
            raise ValidationError(
                "Producto inválido."
            )

        queryset = queryset.filter(
            product_id=product
        )

    return queryset