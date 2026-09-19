import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateMenu from "../components/CreateMenu";
import api, { getApiError } from "../services/api";
import AccountMenu from "../components/AccountMenu";
import AppNavigation from "../components/AppNavigation";
import BulkCategorizeModal from "../components/BulkCategorizeModal";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import {
    Package,
    Search,
    X,
    Tag,
    Tags,
    Plus,
    Check,
    CheckSquare,
    Square,
    ChevronRight,
    Sparkles,
} from "lucide-react";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [sort, setSort] = useState("name");
    
    // Multi-Selection / Batch Categorization State
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get(`products/?sort=${sort}`),
                    api.get("categories/").catch(() => ({ data: [] })),
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error(err);
                setError(
                    getApiError(err, "No se pudieron cargar los productos.")
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [sort]);

    const uncategorizedCount = products.filter((p) => !p.category).length;

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
        const matchesCategory =
            selectedCategory === "all"
                ? true
                : selectedCategory === "uncategorized"
                ? !product.category
                : String(product.category) === String(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const selectedProductList = products.filter((p) => selectedIds.has(p.id));
    const allFilteredSelected =
        filteredProducts.length > 0 &&
        filteredProducts.every((p) => selectedIds.has(p.id));

    function toggleSelect(id) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function toggleSelectAll() {
        if (allFilteredSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
        }
    }

    function handleBulkSuccess({ updatedCount, categoryId, categoryName }) {
        setProducts((prev) =>
            prev.map((p) => {
                if (selectedIds.has(p.id)) {
                    return {
                        ...p,
                        category: categoryId,
                        category_name: categoryName,
                    };
                }
                return p;
            })
        );
        setSelectedIds(new Set());
        setIsSelectMode(false);
    }

    function cancelSelectionMode() {
        setIsSelectMode(false);
        setSelectedIds(new Set());
    }

    return (
        <div className="min-h-screen px-4 pt-4 pb-32">
            <div className="mx-auto max-w-lg space-y-5">

                {/* Header */}
                <header className="flex items-center justify-between gap-3 pt-safe">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                Catálogo
                            </h1>
                            <p className="text-xs text-[var(--text-secondary)]">
                                {products.length} productos registrados
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {/* Toggle Selection / Organize Mode Button */}
                        <button
                            type="button"
                            onClick={() => {
                                if (isSelectMode) {
                                    cancelSelectionMode();
                                } else {
                                    setIsSelectMode(true);
                                }
                            }}
                            className={`
                                flex
                                items-center
                                gap-1.5
                                rounded-xl
                                px-3
                                py-2
                                text-xs
                                font-bold
                                transition
                                active-press
                                border
                                ${
                                    isSelectMode
                                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                        : "bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--primary)]/50"
                                }
                            `}
                        >
                            <Tags className="w-3.5 h-3.5" />
                            <span>{isSelectMode ? "Listo" : "Organizar"}</span>
                        </button>

                        {!isSelectMode && (
                            <Link
                                to="/products/new"
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
                                <span>Nuevo</span>
                            </Link>
                        )}
                        <AccountMenu user={user} />
                    </div>
                </header>

                {/* Selection Mode Control Bar */}
                {isSelectMode && (
                    <div className="flex items-center justify-between rounded-2xl border border-[var(--primary)]/30 bg-[var(--surface)] p-3 shadow-sm animate-pop-in">
                        <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline active-press"
                        >
                            {allFilteredSelected ? (
                                <CheckSquare className="w-4 h-4" />
                            ) : (
                                <Square className="w-4 h-4" />
                            )}
                            <span>
                                {allFilteredSelected
                                    ? "Deseleccionar todos"
                                    : `Seleccionar visibles (${filteredProducts.length})`}
                            </span>
                        </button>

                        <span className="text-xs font-bold text-[var(--text-secondary)]">
                            {selectedIds.size} seleccionado{selectedIds.size !== 1 ? "s" : ""}
                        </span>
                    </div>
                )}

                {/* Search and Sort Controls */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                        <input
                            type="search"
                            placeholder="Buscar producto por nombre..."
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

                    {/* Category Filter Chips (Horizontal Scroll) */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory("all")}
                            className={`
                                shrink-0
                                rounded-xl
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                transition
                                active-press
                                border
                                ${
                                    selectedCategory === "all"
                                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                        : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)]"
                                }
                            `}
                        >
                            Todos
                        </button>

                        {/* Uncategorized quick chip */}
                        {uncategorizedCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setSelectedCategory("uncategorized")}
                                className={`
                                    shrink-0
                                    rounded-xl
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-bold
                                    transition
                                    active-press
                                    border
                                    ${
                                        selectedCategory === "uncategorized"
                                            ? "bg-[var(--warning)] text-white border-[var(--warning)] shadow-sm"
                                            : "bg-[var(--surface)] text-[var(--warning)] border-[var(--warning)]/40 hover:border-[var(--warning)]"
                                    }
                                `}
                            >
                                Sin categoría ({uncategorizedCount})
                            </button>
                        )}

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`
                                    shrink-0
                                    rounded-xl
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-bold
                                    transition
                                    active-press
                                    border
                                    ${
                                        String(selectedCategory) === String(cat.id)
                                            ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                            : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)]"
                                    }
                                `}
                            >
                                {capitalizeWords(cat.name)}
                            </button>
                        ))}
                    </div>

                    {/* Sort Selector */}
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
                            <option value="sales">Más vendidos</option>
                            <option value="gross">Mayor ingreso</option>
                            <option value="earnings">Mayor ganancia</option>
                            <option value="recent">Venta más reciente</option>
                        </select>
                    </div>
                </div>

                {/* State: Loading / Error / Empty */}
                {isLoading && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                        <p className="text-xs font-semibold text-[var(--text-secondary)]">
                            Cargando catálogo...
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

                {!isLoading && !error && filteredProducts.length === 0 && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[var(--text-secondary)]">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-[var(--text-primary)]">
                                No se encontraron productos
                            </p>
                            <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                {search
                                    ? "Prueba buscando con otro término."
                                    : "Los productos creados aparecerán aquí."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Products List */}
                {!isLoading && !error && filteredProducts.length > 0 && (
                    <div className="space-y-2.5">
                        {filteredProducts.map((product) => {
                            const isSelected = selectedIds.has(product.id);

                            if (isSelectMode) {
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => toggleSelect(product.id)}
                                        className={`
                                            cursor-pointer
                                            flex
                                            items-center
                                            justify-between
                                            rounded-2xl
                                            border
                                            p-4
                                            shadow-sm
                                            transition-all
                                            active-press
                                            ${
                                                isSelected
                                                    ? "border-[var(--primary)] bg-[var(--surface)] ring-2 ring-[var(--primary)]/25"
                                                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div
                                                className={`
                                                    flex
                                                    h-6
                                                    w-6
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border
                                                    transition
                                                    shrink-0
                                                    ${
                                                        isSelected
                                                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                                            : "border-[var(--border)] bg-[var(--surface-accent)]"
                                                    }
                                                `}
                                            >
                                                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                                            </div>

                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h2 className="truncate text-base font-bold text-[var(--text-primary)]">
                                                        {capitalizeWords(product.name)}
                                                    </h2>
                                                    {product.category_name && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                                                            <Tag className="w-2.5 h-2.5" />
                                                            {capitalizeWords(product.category_name)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                                                    <div>
                                                        <span>Ventas: </span>
                                                        <span className="font-bold text-[var(--text-primary)]">
                                                            {product.sales_count || 0}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span>Ingresos: </span>
                                                        <span className="font-bold text-[var(--text-primary)]">
                                                            {formatCurrency(product.gross || 0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {product.earnings > 0 && (
                                                <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-1 text-xs font-bold text-[var(--success)] border border-[var(--success-border)]">
                                                    +{formatCurrency(product.earnings)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={product.id}
                                    to={`/products/${product.id}`}
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        border
                                        border-[var(--border)]
                                        bg-[var(--surface)]
                                        p-4
                                        shadow-sm
                                        transition-all
                                        active-press
                                        hover:border-[var(--primary)]/40
                                        hover:shadow-md
                                    "
                                >
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="truncate text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                                {capitalizeWords(product.name)}
                                            </h2>
                                            {product.category_name && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                                                    <Tag className="w-2.5 h-2.5" />
                                                    {capitalizeWords(product.category_name)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                                            <div>
                                                <span>Ventas: </span>
                                                <span className="font-bold text-[var(--text-primary)]">
                                                    {product.sales_count || 0}
                                                </span>
                                            </div>
                                            <div>
                                                <span>Ingresos: </span>
                                                <span className="font-bold text-[var(--text-primary)]">
                                                    {formatCurrency(product.gross || 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {product.earnings > 0 && (
                                            <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-1 text-xs font-bold text-[var(--success)] border border-[var(--success-border)]">
                                                +{formatCurrency(product.earnings)}
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* Floating Multi-Select Action Bar */}
            {isSelectMode && selectedIds.size > 0 && (
                <div className="fixed bottom-20 left-0 right-0 z-40 px-4 animate-pop-in">
                    <div className="mx-auto flex max-w-lg items-center justify-between rounded-3xl border border-[var(--primary)]/40 bg-[var(--surface)] p-3.5 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-2 pl-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--primary)] text-xs font-extrabold text-white">
                                {selectedIds.size}
                            </span>
                            <span className="text-xs font-bold text-[var(--text-primary)]">
                                seleccionado{selectedIds.size !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={cancelSelectionMode}
                                className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] transition active-press"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsBulkModalOpen(true)}
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    rounded-xl
                                    bg-[var(--primary)]
                                    px-4
                                    py-2
                                    text-xs
                                    font-extrabold
                                    text-white
                                    shadow-md
                                    shadow-[var(--primary)]/25
                                    transition
                                    active-press
                                    hover:bg-[var(--primary-hover)]
                                "
                            >
                                <Tags className="w-3.5 h-3.5" />
                                <span>Asignar Categoría</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Categorize Modal */}
            <BulkCategorizeModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                selectedProductIds={Array.from(selectedIds)}
                selectedProducts={selectedProductList}
                categories={categories}
                onSuccess={handleBulkSuccess}
            />

            {/* Bottom Navigation */}
            <AppNavigation />
        </div>
    );
}

export default Products;