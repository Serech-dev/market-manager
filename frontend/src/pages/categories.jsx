import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import AppNavigation from "../components/AppNavigation";
import CategoryRankModal from "../components/CategoryRankModal";
import { capitalizeWords } from "../utils/capitalizeWords";
import { formatCurrency } from "../utils/formatCurrency";
import api, { getApiError } from "../services/api";
import FilterBar from "../components/FilterBar";
import { usePrivacy } from "../context/PrivacyContext";
import {
    Tags,
    Plus,
    Search,
    X,
    Package,
    TrendingUp,
    Trophy,
    ChevronRight,
    Sparkles,
} from "lucide-react";

function Categories() {
    const { isPrivate } = usePrivacy();
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [sort, setSort] = useState("name");
    const [isRankModalOpen, setIsRankModalOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );
    const [filterMode, setFilterMode] = useState("month");
    const [selectedDateFrom, setSelectedDateFrom] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedDateTo, setSelectedDateTo] = useState(
        new Date().toISOString().split("T")[0]
    );
    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );

    const invalidPeriod =
        filterMode === "period" &&
        selectedDateFrom > selectedDateTo;

    useEffect(() => {
        async function fetchCategories() {
            if (invalidPeriod) {
                return;
            }

            const query =
                filterMode === "day"
                    ? `date=${selectedDate}`
                    : filterMode === "month"
                    ? `month=${selectedMonth}`
                    : `date_from=${selectedDateFrom}&date_to=${selectedDateTo}`;

            try {
                const response = await api.get(
                    `categories/?${query}&sort=${sort}`
                );
                setCategories(response.data);
            } catch (err) {
                console.error(err);
                setError(
                    getApiError(
                        err,
                        "No se pudieron cargar las categorías."
                    )
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchCategories();
    }, [
        selectedDate,
        selectedMonth,
        selectedDateFrom,
        selectedDateTo,
        filterMode,
        sort,
    ]);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    function getPeriodLabel() {
        if (filterMode === "day") {
            const [y, m, d] = selectedDate.split("-");
            return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
                weekday: "long",
                day: "numeric",
                month: "long",
            });
        }
        if (filterMode === "month") {
            const [y, m] = selectedMonth.split("-");
            return new Date(y, m - 1).toLocaleDateString("es-AR", {
                month: "long",
                year: "numeric",
            });
        }
        return `${selectedDateFrom} — ${selectedDateTo}`;
    }

    return (
        <div className="min-h-screen px-4 pt-4 pb-32">
            <div className="mx-auto max-w-lg space-y-5">

                {/* Top Header */}
                <header className="flex items-center justify-between gap-3 pt-safe">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20">
                            <Tags className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                Categorías
                            </h1>
                            <p className="text-xs text-[var(--text-secondary)]">
                                Rendimiento por tipo de producto
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {/* Ranking Comparison Modal Button */}
                        <button
                            type="button"
                            onClick={() => setIsRankModalOpen(true)}
                            className="
                                flex
                                items-center
                                gap-1.5
                                rounded-xl
                                bg-[var(--warning)]
                                px-3
                                py-2
                                text-xs
                                font-extrabold
                                text-white
                                shadow-sm
                                transition
                                active-press
                                hover:brightness-110
                            "
                            title="Comparar y rankear categorías"
                        >
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Ranking</span>
                        </button>

                        <Link
                            to="/products/categories/new"
                            className="
                                flex
                                items-center
                                gap-1.5
                                rounded-xl
                                bg-[var(--primary)]
                                px-3
                                py-2
                                text-xs
                                font-bold
                                text-white
                                shadow-sm
                                transition
                                active-press
                                hover:bg-[var(--primary-hover)]
                            "
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Nueva</span>
                        </Link>
                        <AccountMenu user={user} />
                    </div>
                </header>

                {/* Filter Bar */}
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

                {/* Search & Sort */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                        <input
                            type="search"
                            placeholder="Buscar categoría..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]
                                py-3
                                pl-10
                                pr-10
                                text-sm
                                font-medium
                                text-[var(--text-primary)]
                                outline-none
                                transition
                                focus:border-[var(--primary)]
                                focus:ring-2
                                focus:ring-[var(--primary)]/20
                            "
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">
                            Ordenar por:
                        </span>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="
                                rounded-xl
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                text-[var(--text-primary)]
                                outline-none
                                focus:border-[var(--primary)]
                            "
                        >
                            <option value="name">Nombre (A–Z)</option>
                            <option value="earnings">Mayor ganancia</option>
                            <option value="gross">Mayor ingreso</option>
                            <option value="sales">Más ventas</option>
                            <option value="products">Más productos</option>
                            <option value="recent">Venta más reciente</option>
                        </select>
                    </div>
                </div>

                {/* Loading / Error / Empty States */}
                {isLoading && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                        <p className="text-xs font-semibold text-[var(--text-secondary)]">
                            Cargando categorías...
                        </p>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                        <p className="text-xs font-semibold text-[var(--danger)]">
                            {error}
                        </p>
                    </div>
                )}

                {!isLoading && !error && filteredCategories.length === 0 && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[var(--text-secondary)]">
                            <Tags className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-[var(--text-primary)]">
                                No se encontraron categorías
                            </p>
                            <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                {search
                                    ? "Prueba buscando con otro término."
                                    : "Las categorías te ayudarán a organizar tus productos y medir ganancias."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Categories Grid (Clickable Cards with Valid Metrics) */}
                {!isLoading && !error && filteredCategories.length > 0 && (
                    <div className="space-y-3">
                        {filteredCategories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/categories/${category.id}`}
                                className="
                                    group
                                    block
                                    rounded-2xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-4
                                    shadow-sm
                                    space-y-3
                                    transition-all
                                    active-press
                                    hover:border-[var(--primary)]/40
                                    hover:shadow-md
                                "
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-accent)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                            <Tags className="w-4 h-4" />
                                        </div>
                                        <h2 className="truncate text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                            {capitalizeWords(category.name)}
                                        </h2>
                                        {category.margin_percentage > 0 && (
                                            <span className="inline-flex items-center rounded-full bg-[var(--surface-accent)] px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] shrink-0">
                                                {category.margin_percentage}% margen
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {Number(category.earnings || 0) > 0 && (
                                            <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-1 text-xs font-bold text-[var(--success)] border border-[var(--success-border)]">
                                                +{formatCurrency(category.earnings, { isPrivate })}
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-1.5 border-t border-[var(--border)] pt-2.5 text-center text-xs">
                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-2">
                                        <p className="text-[var(--text-secondary)] text-[9px] uppercase font-bold">Productos</p>
                                        <p className="mt-0.5 font-bold text-[var(--text-primary)]">{category.products_count}</p>
                                    </div>

                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-2">
                                        <p className="text-[var(--text-secondary)] text-[9px] uppercase font-bold">Ventas</p>
                                        <p className="mt-0.5 font-bold text-[var(--text-primary)]">{category.sales_count}</p>
                                    </div>

                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-2">
                                        <p className="text-[var(--text-secondary)] text-[9px] uppercase font-bold">Ingresos</p>
                                        <p className="mt-0.5 font-bold text-[var(--text-primary)]">{formatCurrency(category.gross, { isPrivate })}</p>
                                    </div>

                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-2">
                                        <p className="text-[var(--text-secondary)] text-[9px] uppercase font-bold">Ticket Prom.</p>
                                        <p className="mt-0.5 font-bold text-[var(--text-primary)]">{formatCurrency(category.average_ticket || 0, { isPrivate })}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>

            {/* Category Ranking Comparison Modal */}
            <CategoryRankModal
                isOpen={isRankModalOpen}
                onClose={() => setIsRankModalOpen(false)}
                categories={categories}
                periodLabel={getPeriodLabel()}
            />

            {/* Bottom Navigation */}
            <AppNavigation />
        </div>
    );
}

export default Categories;