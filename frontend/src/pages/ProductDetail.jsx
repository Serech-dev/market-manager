import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import SaleCard from "../components/SaleCard";
import FilterBar from "../components/FilterBar";
import api, { getApiError } from "../services/api";
import SummaryCard from "../components/SummaryCard";
import AppNavigation from "../components/AppNavigation";
import { formatCurrency } from "../utils/formatCurrency";
import { formatProductName } from "../utils/formatProductName";
import { Link, useNavigate, useParams } from "react-router-dom";


function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

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

    const navigate = useNavigate();

    async function archiveProduct() {
        try {
            const response = await api.patch(
                `products/${id}/archive/`
            );

            toast.success("Producto archivado.");
            navigate("/products");
        } catch (error) {

            toast.error(
                getApiError(
                    error,
                    "No se pudo archivar el producto."
                )
            );
        }
    }

    useEffect(() => {
        async function fetchProductData() {
            let periodQuery;

            if (filterMode === "day") {
                periodQuery = `date=${selectedDate}`;
            } else if (filterMode === "month") {
                periodQuery = `month=${selectedMonth}`;
            } else {
                periodQuery =
                    `date_from=${selectedDateFrom}` +
                    `&date_to=${selectedDateTo}`;
            }

            try {
                const [productResponse, salesResponse] =
                    await Promise.all([
                        api.get(`products/${id}/?${periodQuery}`),
                        api.get(
                            `sales/?product=${id}&${periodQuery}`
                        ),
                    ]);

                setProduct(productResponse.data);
                setSales(salesResponse.data);
            } catch (error) {
                console.error(error);

                setError(
                    getApiError(
                        error,
                        "No se pudo cargar el producto."
                    )
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchProductData();
    }, [
        id,
        filterMode,
        selectedDate,
        selectedMonth,
        selectedDateFrom,
        selectedDateTo,
    ]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--surface)] px-4 py-8">
                <div className="mx-auto max-w-5xl">
                    <p className="text-[var(--text-secondary)]">
                        Cargando producto...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[var(--surface)] px-4 py-8">
                <div className="mx-auto max-w-5xl space-y-6">
                    <Link
                        to="/products"
                        className="text-sm font-medium text-[var(--primary)]"
                    >
                        ← Volver a productos
                    </Link>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                        <p className="text-[var(--text-primary)]">
                            {error || "Producto no encontrado."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--surface)] px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">

                <header>
                    <Link
                        to="/products"
                        className="text-sm font-medium text-[var(--primary)] transition hover:opacity-80"
                    >
                        ← Productos
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold text-[var(--text-primary)]">
                        {formatProductName(product.name)}
                    </h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Rendimiento histórico del producto
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
                        selectedDateFrom={selectedDateFrom}
                        setSelectedDateFrom={setSelectedDateFrom}
                        selectedDateTo={selectedDateTo}
                        setSelectedDateTo={setSelectedDateTo}
                    />
                </section>

                <section>
                    <div className="mb-3">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                            Resumen
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            Rendimiento acumulado
                        </p>
                    </div>

                    <div className="space-y-4">

                        <div className="flex justify-center">
                            <SummaryCard
                                title="Ganancia"
                                value={product.earnings}
                                variant="profit"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <SummaryCard
                                title="Ingresos"
                                value={product.gross}
                            />

                            <SummaryCard
                                title="Inversión"
                                value={product.investment}
                            />
                        </div>

                    </div>
                </section>


                <section>
                    <div className="mb-3">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                            Rendimiento
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            Datos generales de este producto
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Ventas
                            </p>

                            <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                                {product.sales_count}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Venta promedio
                            </p>

                            <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                                {formatCurrency(product.average_sale)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Ganancia promedio
                            </p>

                            <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                                {product.sales_count
                                    ? formatCurrency(
                                        product.earnings /
                                        product.sales_count
                                    )
                                    : formatCurrency(0)}
                            </p>
                        </div>

                    </div>
                </section>


                <section>
                    <div className="mb-3">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                            Actividad
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            Historial de actividad del producto
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Primera venta
                            </p>

                            <p className="mt-2 font-semibold text-[var(--text-primary)]">
                                {product.first_sale
                                    ? new Date(
                                        `${product.first_sale}T00:00:00`
                                    ).toLocaleDateString("es-AR")
                                    : "Sin ventas"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Última venta
                            </p>

                            <p className="mt-2 font-semibold text-[var(--text-primary)]">
                                {product.last_sale
                                    ? new Date(
                                        `${product.last_sale}T00:00:00`
                                    ).toLocaleDateString("es-AR")
                                    : "Sin ventas"}
                            </p>
                        </div>

                    </div>
                </section>


                <section>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                            Ventas
                        </h2>

                        <p className="mt-1 text-[var(--text-secondary)]">
                            Historial de ventas de este producto
                        </p>
                    </div>

                    <div className="space-y-4">
                        {sales.length === 0 ? (
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                                <p className="font-medium text-[var(--text-primary)]">
                                    No hay ventas registradas.
                                </p>
                            </div>
                        ) : (
                            sales.map((sale) => (
                                <SaleCard
                                    key={sale.id}
                                    sale={sale}
                                    showActions={false}
                                />
                            ))
                        )}
                    </div>
                </section>

                {product.sales_count === 0 && (
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={archiveProduct}
                            className="
                                rounded-xl
                                border
                                border-red-200
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-red-600
                                transition
                                hover:bg-red-50
                                hover:border-red-300
                            "
                        >
                            Archivar producto
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ProductDetail;