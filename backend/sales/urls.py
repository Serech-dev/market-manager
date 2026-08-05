from django.urls import path

from .views import SaleDetailView, SaleListCreateView, SaleSummaryView

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
    SaleDetailView.as_view(),
    name="sale-detail",
),
]