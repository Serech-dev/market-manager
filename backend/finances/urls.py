from django.urls import path

from .views import TransactionListCreateView, TransactionSummaryView

urlpatterns = [
    path(
        "transactions/",
        TransactionListCreateView.as_view(),
        name="transaction-list-create",
    ),
    path(
        "transactions/summary",
        TransactionSummaryView.as_view(),
        name="transaction-summary",
    )
]