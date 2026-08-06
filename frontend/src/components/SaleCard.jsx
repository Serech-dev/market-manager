import { useNavigate } from "react-router-dom";

function SaleCard({ sale, onDelete }) {
    const navigate = useNavigate();
    const profit = sale.gross_amount - sale.investment_amount;

    return (
        <div className="rounded-xl bg-white p-5 text-white shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {sale.description}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {sale.date}
                    </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    ${profit}
                </span>
            </div>

            <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                    <span>Ingreso bruto</span>
                    <span className="font-semibold">
                        ${sale.gross_amount}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Inversión</span>
                    <span className="font-semibold">
                        ${sale.investment_amount}
                    </span>
                </div>
            </div>

            <div className="mt-5 flex gap-3">
                <button
                    className="flex-1 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate(`/sales/${sale.id}/edit`)}
                >
                    Editar
                </button>

                <button
                    className="flex-1 rounded-lg bg-red-600 py-2 text-white hover:bg-red-700"
                    onClick={() => onDelete(sale.id)}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}

export default SaleCard;