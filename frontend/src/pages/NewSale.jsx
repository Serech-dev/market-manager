import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NewSale() {
    const navigate = useNavigate();

    const [sale, setSale] = useState({
        description: "",
        gross_amount: "",
        investment_amount: "",
        date: new Date().toISOString().split("T")[0],
    });

    function handleChange(event) {
        setSale({
            ...sale,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await api.post("sales/", sale);

            console.log("Venta creada:", response.data);

            navigate("/");
        } catch (error) {
            console.error(
                "Error creando venta:",
                error.response?.data || error.message
            );
        }
    }

    return (
        <div>
            <h1>Nueva Venta</h1>

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
        </div>
    );
}

export default NewSale;