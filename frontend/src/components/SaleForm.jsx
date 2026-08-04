import { useState } from "react";


function SaleForm({ onSubmit, initialSale }) {
    const [sale, setSale] = useState(
        initialSale || {
            description: "",
            gross_amount: "",
            investment_amount: "",
            date: new Date().toISOString().split("T")[0],
        }
    );

    function handleChange(event) {
        setSale({
            ...sale,
            [event.target.name]: event.target.value,
        });
    }

    function handleSubmit(event) {
    event.preventDefault();

    onSubmit(sale);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Descripción</label>
                <input
                    type="text"
                    name="description"
                    value={sale.description}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Ingreso Bruto</label>
                <input
                    type="number"
                    name="gross_amount"
                    value={sale.gross_amount}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Inversión</label>
                <input
                    type="number"
                    name="investment_amount"
                    value={sale.investment_amount}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Fecha</label>
                <input
                    type="date"
                    name="date"
                    value={sale.date}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">
                Guardar Venta
            </button>
        </form>
    );
}

export default SaleForm;