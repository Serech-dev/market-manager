from datetime import datetime
from rest_framework.exceptions import ValidationError


def apply_period_filter(queryset, params):
    date = params.get("date")
    month = params.get("month")

    if date and month:
        raise ValidationError(
            "Use either date or month, not both."
        )

    if date:
        try:
            parsed_date = datetime.strptime(
                date,
                "%Y-%m-%d"
            ).date()
        except ValueError:
            raise ValidationError(
                "Invalid date format. Use YYYY-MM-DD."
            )

        return queryset.filter(date=parsed_date)

    if month:
        try:
            year, month_num = month.split("-")
            year = int(year)
            month_num = int(month_num)

        except ValueError:
            raise ValidationError(
                "Invalid month format. Use YYYY-MM."
            )

        return queryset.filter(
            date__year=year,
            date__month=month_num,
        )

    return queryset.filter(
        date=datetime.now().date()
    )