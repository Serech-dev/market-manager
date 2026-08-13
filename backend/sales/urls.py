from django.urls import path

from .views import (ProductAnalyticsView, ProductArchiveView, ProductListView,
                    SaleDetailView, SaleListCreateView, SaleSummaryView)

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
    path(
        "products/",
        ProductListView.as_view(),
        name="product-list",
    ),
    path(
        "products/<int:pk>/",
        ProductAnalyticsView.as_view(),
        name="product-analytics",
    ),
    path(
    "products/<int:pk>/archive/",
    ProductArchiveView.as_view(),
    name="product-archive",
),
]