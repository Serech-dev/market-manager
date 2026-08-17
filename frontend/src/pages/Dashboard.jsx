import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import SaleCard from "../components/SaleCard";
import FilterBar from "../components/FilterBar";
import api, { getApiError } from "../services/api";
import SummaryCard from "../components/SummaryCard";
import AccountMenu from "../components/AccountMenu";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import ThemeSelector from "../components/ThemeSelector";
import AppNavigation from "../components/AppNavigation";


function Dashboard() {
    const [summary, setSummary] = useState({
        gross: 0,
        investment: 0,
        earnings: 0,
    });

    const navigate = useNavigate();

    const [sales, setSales] = useState([]);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [filterMode, setFilterMode] = useState("day");

    const [selectedDateFrom, setSelectedDateFrom] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [selectedDateTo, setSelectedDateTo] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [saleToDelete, setSaleToDelete] = useState(null);

    async function handleDelete(id) {
        try {
            await api.delete(`sales/${id}/`);

            toast.success("Venta eliminada.");

            setSales((currentSales) =>
                currentSales.filter((sale) => sale.id !== id)
            );

            fetchData();

        } catch (error) {
            console.error(error);

            toast.error(
                getApiError(
                    error,
                    "No se pudo eliminar la venta."
                )
            );
        }
    }

    async function fetchData() {
        if (
            filterMode === "period" &&
            selectedDateFrom > selectedDateTo
        ) {
            return;
        }

        const query =
            filterMode === "day"
                ? `date=${selectedDate}`
                : filterMode === "month"
                ? `month=${selectedMonth}`
                : `date_from=${selectedDateFrom}&date_to=${selectedDateTo}`;

        try {
            const summaryResponse = await api.get(
                `sales/summary/?${query}`
            );

            setSummary(summaryResponse.data);

            const salesResponse = await api.get(
                `sales/?${query}`
            );

            setSales(salesResponse.data);

        } catch (error) {
            console.error(error);

            toast.error(
                getApiError(
                    error,
                    "No se pudo cargar la información."
                )
            );
        }
    }

    useEffect(() => {
        fetchData();
    }, [
        selectedDate,
        selectedMonth,
        selectedDateFrom,
        selectedDateTo,
        filterMode,
    ]);

    function getPeriodLabel() {
        if (filterMode === "day") {
            return new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                "es-AR",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            );
        }

        if (filterMode === "month") {
            return new Date(`${selectedMonth}-01T00:00:00`).toLocaleDateString(
                "es-AR",
                {
                    month: "long",
                    year: "numeric",
                }
            );
        }

        const from = new Date(
            `${selectedDateFrom}T00:00:00`
        ).toLocaleDateString("es-AR");

        const to = new Date(
            `${selectedDateTo}T00:00:00`
        ).toLocaleDateString("es-AR");

        return `${from} — ${to}`;
    }

    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );

    const invalidPeriod =
        filterMode === "period" &&
        selectedDateFrom > selectedDateTo;

    return (
        <div className="min-h-screen bg-[var(--background)] px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">

                <header className="flex h-[72px] items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                            Market Manager
                        </h1>

                        <p className="mt-1 text-[var(--text-secondary)]">
                            Controla tus ventas, inversiones y ganancias
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2 whitespace-nowrap">
                        <AccountMenu user={user} />
                    </div>
                </header>

                <AppNavigation />

                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)] p-5 shadow-sm">
                    <FilterBar
                        filterMode={filterMode}
                        setFilterMode={setFilterMode}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedDateFrom={selectedDateFrom}
                        setSelectedDateFrom={setSelectedDateFrom}
                        selectedDateTo={selectedDateTo}
                        setSelectedDateTo={setSelectedDateTo}
                        invalidPeriod={invalidPeriod}
                    />
                </section>


                <section>
                    <div className="mb-3">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                            Resumen
                        </h2>

                        <p className="mt-1 text-sm capitalize text-[var(--text-secondary)]">
                            {getPeriodLabel()}
                        </p>
                    </div>

                    <div className="space-y-4">

                        <div className="flex justify-center">
                            <SummaryCard
                                title="Ganancia"
                                value={summary.earnings}
                                variant="profit"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <SummaryCard
                                title="Ingresos"
                                value={summary.gross}
                            />

                            <SummaryCard
                                title="Inversión"
                                value={summary.investment}
                            />
                        </div>

                    </div>
                </section>


                <Link
                    to="/new-sale"
                    className="
                        block
                        w-full
                        rounded-xl
                        bg-[var(--primary)]
                        py-3
                        text-center
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-[var(--primary-hover)]
                    "
                >
                    + Nueva Venta
                </Link>


                <section className="mt-10">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        Ventas
                    </h2>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Historial de ventas registradas
                    </p>

                    <div className="mt-5 space-y-4">
                        {sales.length === 0 ? (
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                                <p className="text-lg font-medium text-[var(--text-primary)]">
                                    No hay ventas en este período.
                                </p>

                                <p className="mt-2 text-[var(--text-secondary)]">
                                    No se encontraron ventas para {getPeriodLabel()}.
                                </p>
                            </div>
                        ) : (
                            sales.map((sale) => (
                                <SaleCard
                                    key={sale.id}
                                    sale={sale}
                                    onDelete={setSaleToDelete}
                                />
                            ))
                        )}
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



