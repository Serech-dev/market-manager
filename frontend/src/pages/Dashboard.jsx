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
        <div className="min-h-screen bg-stone-400 px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">

                <header>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Market Manager
                    </h1>

                    <p className="mt-1 text-slate-650">
                        Controla tus ventas, inversiones y ganancias
                    </p>
                </header>


                <section className="rounded-2xl border border-stone-200 bg-stone-300 p-5 shadow-sm">
                    <FilterBar
                        filterMode={filterMode}
                        setFilterMode={setFilterMode}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                    />
                </section>


                <section>
                    <h2 className="mb-3 text-xl font-semibold text-slate-800">
                        Resumen
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">
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
                </section>


                <Link to="/new-sale">
                    <button
                        className="
                            mt-2
                            w-full
                            rounded-xl
                            bg-blue-500
                            py-3
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-blue-600
                        "
                    >
                        + Nueva Venta
                    </button>
                </Link>


                <section>
                    <h2 className="mb-3 text-xl font-semibold text-slate-800">
                        Ventas
                    </h2>

                    <div className="space-y-4">
                        {sales.map((sale) => (
                            <SaleCard
                                key={sale.id}
                                sale={sale}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
export default Dashboard;



