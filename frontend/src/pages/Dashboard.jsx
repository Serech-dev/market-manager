import { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCard from "../components/SummaryCard";
import FilterBar from "../components/FilterBar";
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

    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [filterMode, setFilterMode] = useState("day");

    async function handleDelete(id) {
        try {
            await api.delete(`sales/${id}/`);

            const query =
                filterMode === "day"
                    ? `date=${selectedDate}`
                    : `month=${selectedMonth}`;

            const response = await api.get(
                `sales/summary/?${query}`
            );

            setSummary(response.data);

            const salesResponse = await api.get(
                `sales/?${query}`
            );

            setSales(salesResponse.data);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const query =
            filterMode === "day"
                ? `date=${selectedDate}`
                : `month=${selectedMonth}`;

        api.get(`sales/summary/?${query}`)
            .then((response) => {
                setSummary(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        api.get(`sales/?${query}`)
            .then((response) => {
                setSales(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, [selectedDate, selectedMonth, filterMode]);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="mx-auto max-w-md space-y-4">

                <h1>Market Manager</h1>

                <FilterBar
                    filterMode={filterMode}
                    setFilterMode={setFilterMode}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                />

                <h2>Resumen</h2>

                <div className="grid grid-cols-1 gap-4">
                    <SummaryCard 
                        title="Ingresos"
                        value={summary.gross}
                    />

                    <SummaryCard
                        title="Inversión"
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
        </div>
    );
}

export default Dashboard;



