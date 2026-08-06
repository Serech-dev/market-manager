import { Link } from "react-router-dom";


function SaleCard({ sale, onDelete }) {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3>{sale.description}</h3>

            <p>Bruto: ${sale.gross_amount}</p>
            <p>Inversión: ${sale.investment_amount}</p>
            <p>
                Ganancia: $
                {sale.gross_amount - sale.investment_amount}
            </p>

            <button
            onClick={() => onDelete(sale.id)}
            >
            Eliminar
            </button>

            <Link to={`/sales/${sale.id}/edit`}>
                <button>
                    Editar
                </button>
            </Link>
        </div>
    );
}

export default SaleCard;
