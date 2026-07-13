from django.db.models import Sum

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class TransactionSummaryView(generics.APIView):
    def get(self, request):
        queryset = Transaction.objects.all()
        income = Transaction.objects.filter(
            category__transaction_type="income"
            ).aggregate(
                total=Sum("amount")
            )["total"]
        expenses = Transaction.objects.filter(
                category__transaction_type="expense"
            ).aggregate(
                total=Sum("amount")
            )["total"]

        summary = {
            "Ingreso" : income or 0
            "Gasto" : expenses or 0
            "Balance" : income - expenses
        }
        return Response(summary)
