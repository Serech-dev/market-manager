from datetime import datetime

from rest_framework.exceptions import ValidationError


def apply_period_filter(queryset, params):
    date = params.get("date")
    month = params.get("month")
    date_from = params.get("date_from")
    date_to = params.get("date_to")

    filters = [bool(date), bool(month), bool(date_from or date_to)]

    if sum(filters) > 1:
        raise ValidationError(
            "Usa solamente un tipo de filtro."
        )

    if date:
        try:
            parsed_date = datetime.strptime(
                date,
                "%Y-%m-%d"
            ).date()
        except ValueError:
            raise ValidationError(
                "Formato de fecha inválido. Usa AAAA-MM-DD."
            )

        return queryset.filter(date=parsed_date)

    if month:
        try:
            year, month_num = month.split("-")
            year = int(year)
            month_num = int(month_num)

        except ValueError:
            raise ValidationError(
                "Formato de mes inválido. Usa AAAA-MM."
            )

        return queryset.filter(
            date__year=year,
            date__month=month_num,
        )

    if date_from or date_to:
        if not date_from or not date_to:
            raise ValidationError(
                "Debes ingresar una fecha de inicio y una fecha de fin."
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
                "Formato de fecha inválido. Usa AAAA-MM-DD."
            )

        if parsed_from > parsed_to:
            raise ValidationError(
                "La fecha de inicio no puede ser posterior a la fecha de fin."
            )

        return queryset.filter(
            date__range=(parsed_from, parsed_to)
        )

    return queryset.filter(
        date=datetime.now().date()
    )