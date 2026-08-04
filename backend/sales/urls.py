from django.urls import path

from .views import SaleListCreateView, SaleSummaryView, SaleDeleteView

urlpatterns = [
    path(
        "sales/",
        SaleListCreateView.as_view(),
        name="sale-list-create",
    ),
    path(
        "sales/summary/",
        SaleSummaryView.as_view(),
        name="sale-summary",
    ),
    path(
    "sales/<int:pk>/",
    SaleDeleteView.as_view(),
    name="sale-delete",
    ),
]