import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import SaleCard from "../components/SaleCard";
import FilterBar from "../components/FilterBar";
import getLocalDate from "../utils/getLocalDate";
import api, { getApiError } from "../services/api";
import SummaryCard from "../components/SummaryCard";
import AccountMenu from "../components/AccountMenu";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import AppNavigation from "../components/AppNavigation";
import DailySummaryModal from "../components/DailySummaryModal";
import { ReceiptText, Plus, ClipboardList, ShoppingBag } from "lucide-react";

function Dashboard() {
    const [summary, setSummary] = useState({
        gross: 0,
        investment: 0,
        earnings: 0,
    });

    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getLocalDate());
    const [selectedMonth, setSelectedMonth] = useState(getLocalDate().slice(0, 7));
    const [filterMode, setFilterMode] = useState("day");
    const [selectedDateFrom, setSelectedDateFrom] = useState(getLocalDate());
    const [selectedDateTo, setSelectedDateTo] = useState(getLocalDate());
    const [saleToDelete, setSaleToDelete] = useState(null);
    const [showDailySummary, setShowDailySummary] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
                getApiError(error, "No se pudo eliminar la venta.")
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

        setIsLoading(true);
        try {
            const summaryResponse = await api.get(`sales/summary/?${query}`);
            setSummary(summaryResponse.data);

            const salesResponse = await api.get(`sales/?${query}`);
            setSales(salesResponse.data);
        } catch (error) {
            console.error(error);
            toast.error(
                getApiError(error, "No se pudo cargar la información.")
            );
        } finally {
            setIsLoading(false);
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

        const from = new Date(`${selectedDateFrom}T00:00:00`).toLocaleDateString("es-AR");
        const to = new Date(`${selectedDateTo}T00:00:00`).toLocaleDateString("es-AR");

        return `${from} — ${to}`;
    }

    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );

    const invalidPeriod =
        filterMode === "period" &&
        selectedDateFrom > selectedDateTo;

    return (
        <div className="min-h-screen px-4 pt-4 pb-28">
            <div className="mx-auto max-w-lg space-y-5">

                {/* Top Header */}
                <header className="flex items-center justify-between gap-3 pt-safe">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                Market Manager
                            </h1>
                            <p className="text-xs text-[var(--text-secondary)]">
                                Registro rápido de feria
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <AccountMenu user={user} />
                    </div>
                </header>

                {/* Date / Period Filter Card */}
                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-sm">
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

                {/* Financial Summary Section */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                Resumen
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] capitalize mt-0.5">
                                {getPeriodLabel()}
                            </p>
                        </div>

                        {/* Daily Tally / Closeout Trigger */}
                        <button
                            type="button"
                            onClick={() => setShowDailySummary(true)}
                            className="
                                flex
                                items-center
                                gap-1.5
                                rounded-xl
                                bg-[var(--surface-accent)]
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                text-[var(--primary)]
                                transition
                                active-press
                                hover:bg-[var(--primary)]
                                hover:text-white
                                border
                                border-[var(--border)]
                            "
                        >
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span>Cierre del Día</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <SummaryCard
                            title="Ganancia"
                            value={summary.earnings}
                            variant="profit"
                            cacheKey="mm_earnings_cache"
                            isLoading={isLoading}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <SummaryCard
                                title="Ingresos"
                                value={summary.gross}
                                cacheKey="mm_gross_cache"
                                isLoading={isLoading}
                            />
                            <SummaryCard
                                title="Inversión"
                                value={summary.investment}
                                cacheKey="mm_investment_cache"
                                isLoading={isLoading}
                            />
                        </div>
                    </div>

                </section>

                {/* Sales Stream Section */}
                <section className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                            <ReceiptText className="w-4 h-4 text-[var(--primary)]" />
                            <span>Ventas registradas ({sales.length})</span>
                        </h2>
                    </div>

                    <div className="space-y-2.5">
                        {sales.length === 0 ? (
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-3">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[var(--text-secondary)]">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-[var(--text-primary)]">
                                        No hay ventas registradas
                                    </p>
                                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                        No se encontraron operaciones para este período.
                                    </p>
                                </div>
                                <Link
                                    to="/new-sale"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-[var(--primary)]
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-bold
                                        text-white
                                        shadow-sm
                                        transition
                                        active-press
                                        hover:bg-[var(--primary-hover)]
                                    "
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Registrar Venta</span>
                                </Link>
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

            {/* Bottom Navigation */}
            <AppNavigation />

            {/* Daily Tally / Closeout Modal */}
            <DailySummaryModal
                isOpen={showDailySummary}
                onClose={() => setShowDailySummary(false)}
                summary={summary}
                sales={sales}
                periodLabel={getPeriodLabel()}
            />

            {/* Confirm Delete Dialog */}
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




