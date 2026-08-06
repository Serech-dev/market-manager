import ConfirmDialog from "../components/ConfirmDialog";
import SummaryCard from "../components/SummaryCard";
import FilterBar from "../components/FilterBar";
import SaleCard from "../components/SaleCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";


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

    const [saleToDelete, setSaleToDelete] = useState(null);

    async function handleDelete(id) {
        try {
            await api.delete(`sales/${id}/`);

            toast.success("Venta eliminada.");

            setSales((currentSales) =>
                currentSales.filter((sale) => sale.id !== id)
            );

        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar la venta.");
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
        <div className="min-h-screen bg-[var(--surface)] px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">

                <header>
                    <h1 className="text-[var(--text-primary)]">
                        Market Manager
                    </h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
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
                    <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
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
                            bg-[var(--primary)]
                            py-3
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-[var(--primary-hover)]
                        "
                    >
                        + Nueva Venta
                    </button>
                </Link>


                <section>
                    <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
                        Ventas
                    </h2>

                    <div className="space-y-4">
                        {sales.length === 0 ? (
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                                <p className="text-lg font-medium text-[var(--text-primary)]">
                                    No hay ventas todavía.
                                </p>

                                <p className="mt-2 text-[var(--text-secondary)]">
                                    Agrega tu primera venta para comenzar.
                                </p>
                            </div>
                        ) : (
                        sales.map((sale) => (
                            <SaleCard
                                key={sale.id}
                                sale={sale}
                                onDelete={setSaleToDelete}
                            />
                        )))}
                    </div>
                </section>

            </div>
            <ConfirmDialog
                isOpen={saleToDelete !== null}
                title="Eliminar venta"
                message="¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer."
                onCancel={() => setSaleToDelete(null)}
                onConfirm={() => {
                    handleDelete(saleToDelete);
                    setSaleToDelete(null);
                }}
            />
        </div>
    );
}
export default Dashboard;



