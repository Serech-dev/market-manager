import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import SaleCard from "../components/SaleCard";
import FilterBar from "../components/FilterBar";
import api, { getApiError } from "../services/api";
import SummaryCard from "../components/SummaryCard";
import AppNavigation from "../components/AppNavigation";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import { Link, useNavigate, useParams } from "react-router-dom";


function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [nameError, setNameError] = useState("");

    const [editingName, setEditingName] = useState(false);
    const [editingCategory, setEditingCategory] = useState(false);

    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const [editingPrice, setEditingPrice] = useState(false);
    const [editingInvestmentPrice, setEditingInvestmentPrice] = useState(false);

    const [editPrice, setEditPrice] = useState("");
    const [editInvestmentPrice, setEditInvestmentPrice] = useState("");

    const [priceError, setPriceError] = useState("");
    const [investmentPriceError, setInvestmentPriceError] = useState("");

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

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await api.get("categories/");
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchCategories();
    }, []);

    async function handleSaveProduct(field) {
        setIsSaving(true);

        if (field === "name") {
            setNameError("");
        }

        if (field === "price") {
            setPriceError("");
        }

        if (field === "investment_price") {
            setInvestmentPriceError("");
        }

        let updates = {};

        if (field === "name") {
            updates = {
                name: editName,
            };
        }

        if (field === "category") {
            updates = {
                category: editCategory || null,
            };
        }

        if (field === "price") {
            updates = {
                price: editPrice === "" ? null : editPrice,
            };
        }

        if (field === "investment_price") {
            updates = {
                investment_price:
                    editInvestmentPrice === ""
                        ? null
                        : editInvestmentPrice,
            };
        }

        try {
            const response = await api.patch(
                `products/${id}/`,
                updates
            );

            setProduct((current) => ({
                ...current,
                ...response.data,
            }));

            if (field === "name") {
                setEditingName(false);
            }

            if (field === "category") {
                setEditingCategory(false);
            }

            if (field === "price") {
                setEditingPrice(false);
            }

            if (field === "investment_price") {
                setEditingInvestmentPrice(false);
            }

            toast.success("Producto actualizado.");
        } catch (error) {
            console.error(error);

            const message = getApiError(
                error,
                "No se pudo actualizar el producto."
            );

            if (field === "name") {
                setNameError(message);
            } else if (field === "price") {
                setPriceError(message);
            } else if (field === "investment_price") {
                setInvestmentPriceError(message);
            } else {
                toast.error(message);
            }
        } finally {
            setIsSaving(false);
        }
    }

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

                    <div className="mt-4 grid gap-5 md:grid-cols-[1fr_auto]">
                        {/* Product information */}
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                {editingName ? (
                                    <div className="flex items-start gap-2">
                                        <div className="w-full max-w-md">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(event) => {
                                                    setEditName(event.target.value);
                                                    setNameError("");
                                                }}
                                                autoFocus
                                                className="
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-[var(--border)]
                                                    bg-[var(--surface)]
                                                    px-3
                                                    py-2
                                                    text-2xl
                                                    font-bold
                                                    text-[var(--text-primary)]
                                                    outline-none
                                                    focus:border-[var(--primary)]
                                                    focus:ring-2
                                                    focus:ring-[var(--primary)]/20
                                                "
                                            />

                                            {nameError && (
                                                <p className="mt-2 text-sm text-[var(--danger)]">
                                                    {nameError}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleSaveProduct("name")}
                                            disabled={isSaving || !editName.trim()}
                                            className="
                                                rounded-lg
                                                bg-[var(--primary)]
                                                px-3
                                                py-2
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-[var(--primary-hover)]
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            {isSaving ? "..." : "Guardar"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEditingName(false)}
                                            className="
                                                rounded-lg
                                                border
                                                border-[var(--border)]
                                                px-3
                                                py-2
                                                text-sm
                                                font-medium
                                                text-[var(--text-secondary)]
                                                transition
                                                hover:bg-[var(--surface-accent)]
                                                hover:text-[var(--text-primary)]
                                            "
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                                            {capitalizeWords(product.name)}
                                        </h1>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditName(product.name);
                                                setNameError("");
                                                setEditingCategory(false);
                                                setEditingPrice(false);
                                                setEditingInvestmentPrice(false);
                                                setEditingName(true);
                                            }}
                                            className="
                                                rounded-lg
                                                border
                                                border-[var(--border)]
                                                px-3
                                                py-1.5
                                                text-sm
                                                font-medium
                                                text-[var(--text-secondary)]
                                                transition
                                                hover:bg-[var(--surface-accent)]
                                                hover:text-[var(--primary)]
                                            "
                                        >
                                            Editar
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-sm font-medium text-[var(--text-secondary)]">
                                    Categoría:
                                </span>

                                {editingCategory ? (
                                    <>
                                        <select
                                            value={editCategory}
                                            onChange={(event) =>
                                                setEditCategory(event.target.value)
                                            }
                                            autoFocus
                                            className="
                                                rounded-xl
                                                border
                                                border-[var(--border)]
                                                bg-[var(--surface)]
                                                px-3
                                                py-2
                                                text-sm
                                                text-[var(--text-primary)]
                                                outline-none
                                                focus:border-[var(--primary)]
                                                focus:ring-2
                                                focus:ring-[var(--primary)]/20
                                            "
                                        >
                                            <option value="">
                                                Sin categoría
                                            </option>

                                            {categories.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {capitalizeWords(item.name)}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() => handleSaveProduct("category")}
                                            disabled={isSaving}
                                            className="
                                                rounded-lg
                                                bg-[var(--primary)]
                                                px-3
                                                py-1.5
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-[var(--primary-hover)]
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            {isSaving ? "..." : "Guardar"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEditingCategory(false)}
                                            className="
                                                rounded-lg
                                                border
                                                border-[var(--border)]
                                                px-3
                                                py-1.5
                                                text-sm
                                                font-medium
                                                text-[var(--text-secondary)]
                                                transition
                                                hover:bg-[var(--surface-accent)]
                                                hover:text-[var(--text-primary)]
                                            "
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm font-medium text-[var(--text-primary)]">
                                            {product.category_name
                                                ? capitalizeWords(product.category_name)
                                                : "Sin categoría"}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditCategory(
                                                    product.category
                                                        ? String(product.category)
                                                        : ""
                                                );
                                                setEditingName(false);
                                                setEditingPrice(false);
                                                setEditingInvestmentPrice(false);
                                                setEditingCategory(true);
                                            }}
                                            className="
                                                rounded-lg
                                                border
                                                border-[var(--border)]
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                text-[var(--text-secondary)]
                                                transition
                                                hover:bg-[var(--surface-accent)]
                                                hover:text-[var(--primary)]
                                            "
                                        >
                                            Editar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Prices */}
                        <div className="flex flex-col gap-4 md:min-w-[240px] md:justify-center">
                            {/* Price */}
                            <div>
                                <p className="text-sm font-medium text-[var(--text-secondary)]">
                                    Precio por unidad
                                </p>

                                {editingPrice ? (
                                    <div className="mt-1">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                                                    $
                                                </span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={editPrice}
                                                    onChange={(event) => {
                                                        setEditPrice(event.target.value);
                                                        setPriceError("");
                                                    }}
                                                    autoFocus
                                                    className="
                                                        w-full
                                                        rounded-xl
                                                        border
                                                        border-[var(--border)]
                                                        bg-[var(--surface)]
                                                        py-2
                                                        pl-7
                                                        pr-3
                                                        text-[var(--text-primary)]
                                                        outline-none
                                                        focus:border-[var(--primary)]
                                                        focus:ring-2
                                                        focus:ring-[var(--primary)]/20
                                                    "
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleSaveProduct("price")}
                                                disabled={isSaving}
                                                className="
                                                    rounded-lg
                                                    bg-[var(--primary)]
                                                    px-3
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    hover:bg-[var(--primary-hover)]
                                                    disabled:opacity-50
                                                "
                                            >
                                                {isSaving ? "..." : "Guardar"}
                                            </button>
                                        </div>

                                        {priceError && (
                                            <p className="mt-2 text-sm text-[var(--danger)]">
                                                {priceError}
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => setEditingPrice(false)}
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-[var(--text-secondary)]
                                                hover:text-[var(--text-primary)]
                                            "
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-1 flex items-center gap-3">
                                        <span className="text-lg font-bold text-[var(--success)]">
                                            {product.price != null
                                                ? formatCurrency(product.price)
                                                : "Sin establecer"}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditPrice(
                                                    product.price != null
                                                        ? String(product.price)
                                                        : ""
                                                );
                                                setEditingName(false);
                                                setEditingCategory(false);
                                                setEditingInvestmentPrice(false);
                                                setEditingPrice(true);
                                            }}
                                            className="
                                                text-xs
                                                font-medium
                                                text-[var(--primary)]
                                                hover:opacity-80
                                            "
                                        >
                                            Editar
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Investment */}
                            <div>
                                <p className="text-sm font-medium text-[var(--text-secondary)]">
                                    Inversión por unidad
                                </p>

                                {editingInvestmentPrice ? (
                                    <div className="mt-1">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                                                    $
                                                </span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={editInvestmentPrice}
                                                    onChange={(event) => {
                                                        setEditInvestmentPrice(event.target.value);
                                                        setInvestmentPriceError("");
                                                    }}
                                                    autoFocus
                                                    className="
                                                        w-full
                                                        rounded-xl
                                                        border
                                                        border-[var(--border)]
                                                        bg-[var(--surface)]
                                                        py-2
                                                        pl-7
                                                        pr-3
                                                        text-[var(--text-primary)]
                                                        outline-none
                                                        focus:border-[var(--primary)]
                                                        focus:ring-2
                                                        focus:ring-[var(--primary)]/20
                                                    "
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSaveProduct("investment_price")
                                                }
                                                disabled={isSaving}
                                                className="
                                                    rounded-lg
                                                    bg-[var(--primary)]
                                                    px-3
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    hover:bg-[var(--primary-hover)]
                                                    disabled:opacity-50
                                                "
                                            >
                                                {isSaving ? "..." : "Guardar"}
                                            </button>
                                        </div>

                                        {investmentPriceError && (
                                            <p className="mt-2 text-sm text-[var(--danger)]">
                                                {investmentPriceError}
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingInvestmentPrice(false)
                                            }
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-[var(--text-secondary)]
                                                hover:text-[var(--text-primary)]
                                            "
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-1 flex items-center gap-3">
                                        <span className="text-lg font-bold text-[var(--success)]">
                                            {product.investment_price != null
                                                ? formatCurrency(product.investment_price)
                                                : "Sin establecer"}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditInvestmentPrice(
                                                    product.investment_price != null
                                                        ? String(product.investment_price)
                                                        : ""
                                                );
                                                setEditingName(false);
                                                setEditingCategory(false);
                                                setEditingPrice(false);
                                                setEditingInvestmentPrice(true);
                                            }}
                                            className="
                                                text-xs
                                                font-medium
                                                text-[var(--primary)]
                                                hover:opacity-80
                                            "
                                        >
                                            Editar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
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
                    />
                </section>

                <section>
                    <div className="mb-3">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                            Rendimiento histórico
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
                                border-[var(--danger-border)]
                                bg-[var(--danger)]
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:brightness-90
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