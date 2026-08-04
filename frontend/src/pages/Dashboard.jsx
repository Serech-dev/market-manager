import { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCard from "../components/SummaryCard";
import SaleCard from "../components/SaleCard";
import { Link } from "react-router-dom";


function Dashboard() {
    const [summary, setSummary] = useState({
        gross: 0,
        investment: 0,
        earnings: 0,
    });
    const [sales, setSales] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    async function handleDelete(id) {
        try {
            await api.delete(`sales/${id}/`);

            setSales((current) =>
                current.filter((sale) => sale.id !== id)
            );

            const response = await api.get(
                `sales/summary/?date=${selectedDate}`
            );

            setSummary(response.data);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        api.get(`sales/summary/?date=${selectedDate}`)
            .then((response) => {
                setSummary(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        api.get(`sales/?date=${selectedDate}`)
            .then((response) => {
                setSales(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [selectedDate]);

    return (
    <div>
        <h1>Market Manager</h1>

        <label>
            Fecha:
            <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                    setSelectedDate(event.target.value);
                }}
            />
        </label>

        <h2>Resumen de Hoy</h2>

        <div>
            <SummaryCard
                title="Bruto"
                value={summary.gross}
            />

            <SummaryCard
                title="Inversion"
                value={summary.investment}
            />

            <SummaryCard
                title="Ganancia"
                value={summary.earnings}
            />
        </div>

        <Link to="/new-sale">
            <button>
                + Nueva Venta
            </button>
        </Link>

        <h2>Ventas</h2>

        {sales.map((sale) => (
            <SaleCard
                key={sale.id}
                sale={sale}
                onDelete={handleDelete}
            />
        ))}
    </div>
    );
}

export default Dashboard;