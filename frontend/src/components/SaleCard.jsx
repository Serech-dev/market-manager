function SaleCard({ sale, onDelete }) {
    return (
        <div className="sale-card">
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
        </div>
    );
}

export default SaleCard;
