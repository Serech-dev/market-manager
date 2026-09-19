import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { getApiError } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import FilterBar from "../components/FilterBar";
import AccountMenu from "../components/AccountMenu";
import AppNavigation from "../components/AppNavigation";
import { usePrivacy } from "../context/PrivacyContext";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Tags,
    TrendingUp,
    DollarSign,
    Coins,
    Percent,
    Receipt,
    Plus,
    X,
    Check,
    Edit2,
    Trash2,
    Package,
    ChevronRight,
    Loader2,
} from "lucide-react";

function CategoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isPrivate } = usePrivacy();

    const [category, setCategory] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Inline Rename State
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState("");
    const [isSavingName, setIsSavingName] = useState(false);

    // Quick Assign Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignSearch, setAssignSearch] = useState("");
    const [selectedAssignIds, setSelectedAssignIds] = useState(new Set());
    const [isAssigning, setIsAssigning] = useState(false);

    // Period Filter State
    const [filterMode, setFilterMode] = useState("month");
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );
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
        fetchCategoryData();
    }, [id, selectedDate, selectedMonth, selectedDateFrom, selectedDateTo, filterMode]);

    async function fetchCategoryData() {
        if (invalidPeriod) return;
        setIsLoading(true);
        try {
            const query =
                filterMode === "day"
                    ? `date=${selectedDate}`
                    : filterMode === "month"
                    ? `month=${selectedMonth}`
                    : `date_from=${selectedDateFrom}&date_to=${selectedDateTo}`;

            const [catRes, prodRes] = await Promise.all([
                api.get(`categories/${id}/?${query}`),
                api.get("products/?sort=name").catch(() => ({ data: [] })),
            ]);

            setCategory(catRes.data);
            setEditName(catRes.data.name);
            setAllProducts(prodRes.data);
        } catch (err) {
            console.error(err);
            setError(getApiError(err, "No se pudo cargar la categoría."));
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSaveName(e) {
        e.preventDefault();
        const trimmed = editName.trim();
        if (!trimmed || isSavingName) return;

        setIsSavingName(true);
        try {
            const res = await api.patch(`categories/${id}/`, { name: trimmed });
            toast.success("Categoría actualizada.");
            setCategory((prev) => ({ ...prev, name: res.data.name }));
            setIsEditingName(false);
        } catch (err) {
            toast.error(getApiError(err, "No se pudo renombrar la categoría."));
        } finally {
            setIsSavingName(false);
        }
    }

    async function handleDeleteCategory() {
        if (!window.confirm(`¿Eliminar la categoría "${capitalizeWords(category.name)}"? Los productos permanecerán sin categoría.`)) {
            return;
        }

        try {
            await api.delete(`categories/${id}/`);
            toast.success("Categoría eliminada.");
            navigate("/categories");
        } catch (err) {
            toast.error(getApiError(err, "No se pudo eliminar la categoría."));
        }
    }

    async function handleRemoveProduct(productId, productName) {
        try {
            await api.patch(`products/${productId}/`, { category: null });
            toast.success(`"${capitalizeWords(productName)}" removido de la categoría.`);
            setCategory((prev) => ({
                ...prev,
                products_count: Math.max(0, (prev.products_count || 1) - 1),
                products: prev.products.filter((p) => p.id !== productId),
            }));
        } catch (err) {
            toast.error(getApiError(err, "No se pudo quitar el producto."));
        }
    }

    async function handleBulkAssign() {
        const productIds = Array.from(selectedAssignIds);
        if (productIds.length === 0 || isAssigning) return;

        setIsAssigning(true);
        try {
            await api.post("products/bulk-categorize/", {
                product_ids: productIds,
                category_id: Number(id),
            });

            toast.success(`${productIds.length} producto${productIds.length > 1 ? "s" : ""} asignado${productIds.length > 1 ? "s" : ""}.`);
            setIsAssignModalOpen(false);
            setSelectedAssignIds(new Set());
            fetchCategoryData();
        } catch (err) {
            toast.error(getApiError(err, "No se pudieron asignar los productos."));
        } finally {
            setIsAssigning(false);
        }
    }

    function toggleAssignSelection(prodId) {
        setSelectedAssignIds((prev) => {
            const next = new Set(prev);
            if (next.has(prodId)) {
                next.delete(prodId);
            } else {
                next.add(prodId);
            }
            return next;
        });
    }

    const availableProductsToAssign = allProducts.filter((p) => {
        const isAlreadyInCat = String(p.category) === String(id);
        const matchesSearch = p.name.toLowerCase().includes(assignSearch.trim().toLowerCase());
        return !isAlreadyInCat && matchesSearch;
    });

    if (isLoading && !category) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-xs font-semibold text-[var(--text-secondary)]">Cargando categoría...</p>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen px-4 pt-8 text-center space-y-4">
                <p className="text-sm font-bold text-[var(--danger)]">{error || "Categoría no encontrada."}</p>
                <button
                    type="button"
                    onClick={() => navigate("/categories")}
                    className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white"
                >
                    Volver a categorías
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 pt-4 pb-32">
            <div className="mx-auto max-w-lg space-y-5">

                {/* Top Header */}
                <header className="flex items-center justify-between gap-3 pt-safe">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => navigate("/categories")}
                            className="
                                flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl
                                border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]
                                transition active-press hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)]
                            "
                            aria-label="Volver a categorías"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                            {isEditingName ? (
                                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        autoFocus
                                        className="rounded-xl border border-[var(--primary)] bg-[var(--surface)] px-2.5 py-1 text-base font-bold text-[var(--text-primary)] outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSavingName}
                                        className="rounded-lg bg-[var(--primary)] p-1 text-white"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingName(false)}
                                        className="p-1 text-[var(--text-secondary)]"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </form>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h1 className="truncate text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                        {capitalizeWords(category.name)}
                                    </h1>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingName(true)}
                                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--primary)]"
                                        title="Editar nombre"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-[var(--text-secondary)]">
                                {category.products_count} producto{category.products_count !== 1 ? "s" : ""} asignado{category.products_count !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={handleDeleteCategory}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--danger)] hover:bg-[var(--danger-bg)] transition active-press"
                            title="Eliminar categoría"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <AccountMenu user={user} />
                    </div>
                </header>

                {/* Period Filter Bar */}
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

                {/* Hero Net Profit Card */}
                <div className="rounded-3xl border border-[var(--success-border)] bg-[var(--success-bg)] p-5 text-center space-y-1 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--success-text)]">
                        Ganancia en Categoría
                    </span>
                    <p className="text-3xl font-black tracking-tight text-[var(--success-text)] sm:text-4xl">
                        +{formatCurrency(category.earnings, { isPrivate })}
                    </p>
                    <p className="text-xs font-semibold text-[var(--success-text)]/80">
                        {category.sales_count} ventas registradas en este período
                    </p>
                </div>

                {/* Category Metric 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Gross Revenue */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1 shadow-sm">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Ingresos Brutos
                        </span>
                        <p className="text-lg font-extrabold text-[var(--text-primary)]">
                            {formatCurrency(category.gross, { isPrivate })}
                        </p>
                    </div>

                    {/* Cost / Investment */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1 shadow-sm">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Inversión / Costo
                        </span>
                        <p className="text-lg font-extrabold text-[var(--text-primary)]">
                            {formatCurrency(category.investment, { isPrivate })}
                        </p>
                    </div>

                    {/* Profit Margin % */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1 shadow-sm">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Margen de Ganancia
                        </span>
                        <div className="flex items-baseline gap-1">
                            <p className="text-lg font-black text-[var(--primary)]">
                                {category.margin_percentage || 0}%
                            </p>
                        </div>
                    </div>

                    {/* Average Ticket */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1 shadow-sm">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Ticket Promedio
                        </span>
                        <p className="text-lg font-extrabold text-[var(--text-primary)]">
                            {formatCurrency(category.average_ticket, { isPrivate })}
                        </p>
                    </div>
                </div>

                {/* Products in this Category Section */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                Productos Asignados ({category.products?.length || 0})
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsAssignModalOpen(true)}
                            className="
                                flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3 py-1.5
                                text-xs font-bold text-white shadow-sm transition active-press hover:bg-[var(--primary-hover)]
                            "
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Asignar Productos</span>
                        </button>
                    </div>

                    {category.products && category.products.length > 0 ? (
                        <div className="space-y-2.5">
                            {category.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="
                                        flex items-center justify-between rounded-2xl border border-[var(--border)]
                                        bg-[var(--surface)] p-3.5 shadow-sm transition hover:border-[var(--primary)]/40
                                    "
                                >
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="min-w-0 flex-1 space-y-1 group"
                                    >
                                        <h3 className="truncate text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                            {capitalizeWords(product.name)}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                                            <span>Ventas: <b className="text-[var(--text-primary)]">{product.sales_count}</b></span>
                                            <span>Ingresos: <b className="text-[var(--text-primary)]">{formatCurrency(product.gross, { isPrivate })}</b></span>
                                        </div>
                                    </Link>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {Number(product.earnings || 0) > 0 && (
                                            <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-1 text-xs font-bold text-[var(--success)] border border-[var(--success-border)]">
                                                +{formatCurrency(product.earnings, { isPrivate })}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(product.id, product.name)}
                                            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] transition"
                                            title="Quitar de categoría"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-3">
                            <Package className="mx-auto w-8 h-8 text-[var(--text-secondary)]" />
                            <p className="text-xs font-semibold text-[var(--text-secondary)]">
                                No hay productos asignados a esta categoría todavía.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsAssignModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface-accent)] px-3.5 py-2 text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Agregar productos ahora</span>
                            </button>
                        </div>
                    )}
                </section>

            </div>

            {/* Quick Product Assignment Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-pop-in">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
                                    <Tags className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                                        Asignar a "{capitalizeWords(category.name)}"
                                    </h3>
                                    <p className="text-[11px] text-[var(--text-secondary)]">
                                        Selecciona los productos que pertenecen aquí
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsAssignModalOpen(false)}
                                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="p-3 border-b border-[var(--border)]">
                            <input
                                type="text"
                                placeholder="Buscar productos para asignar..."
                                value={assignSearch}
                                onChange={(e) => setAssignSearch(e.target.value)}
                                className="
                                    w-full rounded-xl border border-[var(--border)] bg-[var(--background)]
                                    px-3 py-2 text-xs font-medium text-[var(--text-primary)] outline-none
                                    focus:border-[var(--primary)]
                                "
                            />
                        </div>

                        {/* Products Selectable List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                            {availableProductsToAssign.length === 0 ? (
                                <p className="p-6 text-center text-xs text-[var(--text-secondary)]">
                                    {assignSearch ? "No se encontraron productos coincidentes." : "Todos los productos ya están en esta categoría."}
                                </p>
                            ) : (
                                availableProductsToAssign.map((p) => {
                                    const isSelected = selectedAssignIds.has(p.id);
                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => toggleAssignSelection(p.id)}
                                            className={`
                                                flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition active-press
                                                ${
                                                    isSelected
                                                        ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                                        : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-accent)]/50"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div
                                                    className={`
                                                        flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs
                                                        ${
                                                            isSelected
                                                                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                                                : "border-[var(--border)] bg-[var(--surface)]"
                                                        }
                                                    `}
                                                >
                                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                </div>

                                                <span className="truncate text-xs font-semibold text-[var(--text-primary)]">
                                                    {capitalizeWords(p.name)}
                                                </span>
                                            </div>

                                            {p.category_name && (
                                                <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--surface-accent)] px-2 py-0.5 rounded-full shrink-0">
                                                    {capitalizeWords(p.category_name)}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between border-t border-[var(--border)] p-3.5 bg-[var(--surface)]">
                            <span className="text-xs font-bold text-[var(--text-secondary)]">
                                {selectedAssignIds.size} seleccionado{selectedAssignIds.size !== 1 ? "s" : ""}
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBulkAssign}
                                    disabled={selectedAssignIds.size === 0 || isAssigning}
                                    className="
                                        flex items-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2
                                        text-xs font-extrabold text-white transition active-press disabled:opacity-50
                                    "
                                >
                                    {isAssigning ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <span>Asignar ({selectedAssignIds.size})</span>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <AppNavigation />
        </div>
    );
}

export default CategoryDetail;

