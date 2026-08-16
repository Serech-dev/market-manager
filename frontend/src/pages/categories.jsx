import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import CreateMenu from "../components/CreateMenu";
import AppNavigation from "../components/AppNavigation";
import { capitalizeWords } from "../utils/capitalizeWords";
import { formatCurrency } from "../utils/formatCurrency";
import api, { getApiError } from "../services/api";
import FilterBar from "../components/FilterBar";


function Categories() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [sort, setSort] = useState("name");

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
                    `categories/?${query}`
                );

                setCategories(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    getApiError(
                        error,
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
    ]);

    const filteredCategories = categories.filter((category) =>
        category.name.includes(
            search.trim().toLowerCase()
        )
    );

    return (
        <div className="min-h-screen bg-[var(--surface)] px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">

                <header className="flex min-h-[72px] flex-col items-start gap-3">
                    <Link
                        to="/products"
                        className="text-sm font-medium text-[var(--primary)] transition hover:opacity-80"
                    >
                        ← Productos
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                            Categorías
                        </h1>

                        <p className="mt-1 text-[var(--text-secondary)]">
                            Comparación de productos y ventas por categoría
                        </p>
                    </div>
                </header>

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

                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <input
                        type="search"
                        placeholder="Buscar categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            px-4
                            py-3
                            text-[var(--text-primary)]
                            outline-none
                            transition
                            focus:border-[var(--primary)]
                            focus:ring-2
                            focus:ring-[var(--primary)]/20
                        "
                    />

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            px-4
                            py-3
                            text-[var(--text-primary)]
                            outline-none
                            focus:border-[var(--primary)]
                        "
                    >
                        <option value="name">A–Z</option>
                        <option value="products">Más productos</option>
                        <option value="sales">Más ventas</option>
                        <option value="gross">Mayor ingreso</option>
                        <option value="earnings">Mayor ganancia</option>
                        <option value="recent">Venta más reciente</option>
                    </select>
                </div>

                {isLoading && (
                    <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
                        <p className="text-[var(--text-secondary)]">
                            Cargando categorías...
                        </p>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
                        <p className="text-[var(--text-primary)]">
                            {error}
                        </p>
                    </div>
                )}

                {!isLoading && !error && filteredCategories.length === 0 && (
                    <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
                        <p className="text-lg font-medium text-[var(--text-primary)]">
                            No se encontraron categorías.
                        </p>

                        <p className="mt-2 text-[var(--text-secondary)]">
                            {search
                                ? "Prueba con otro término de búsqueda."
                                : "Las categorías aparecerán aquí cuando las crees."}
                        </p>
                    </div>
                )}

                {!isLoading && !error && filteredCategories.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="
                                    rounded-2xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-5
                                    shadow-sm
                                "
                            >
                                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                    {capitalizeWords(category.name)}
                                </h2>

                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Productos
                                        </span>

                                        <span className="font-semibold text-[var(--text-primary)]">
                                            {category.products_count}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Ventas
                                        </span>

                                        <span className="font-semibold text-[var(--text-primary)]">
                                            {category.sales_count}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Ingresos
                                        </span>

                                        <span className="font-semibold text-[var(--text-primary)]">
                                            {formatCurrency(category.gross)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Ganancia
                                        </span>

                                        <span className="font-semibold text-[var(--success)]">
                                            {formatCurrency(category.earnings)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Última venta
                                        </span>

                                        <span className="font-medium text-[var(--text-primary)]">
                                            {category.last_sale || "Sin ventas"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Categories;