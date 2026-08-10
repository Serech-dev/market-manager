import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import { formatProductName } from "../utils/formatProductName";


function SaleCard({ sale, onDelete, showActions = true }) {
    const navigate = useNavigate();
    const profit = sale.gross_amount - sale.investment_amount;

    return (
        <div className="rounded-xl bg-[var(--background)] p-5 text-white shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {formatProductName(sale.product?.name || sale.description)}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {sale.date}
                    </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-[var(--success)]">
                    {formatCurrency(profit)}
                </span>
            </div>

            <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                    <span>Ingreso bruto</span>
                    <span className="font-semibold">
                        {formatCurrency(sale.gross_amount)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Inversión</span>
                    <span className="font-semibold">
                        {formatCurrency(sale.investment_amount)}
                    </span>
                </div>
            </div>

            {showActions && (
                <div className="mt-5 flex gap-3">
                    <button
                        className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-white hover:bg-[var(--primary-hover)]"
                        onClick={() => navigate(`/sales/${sale.id}/edit`)}
                    >
                        Editar
                    </button>

                    <button
                        className="flex-1 rounded-lg bg-[var(--danger)] py-2 text-white hover:bg-[var(--danger-hover)]"
                        onClick={() => onDelete(sale.id)}
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}

export default SaleCard;