import api from "../services/api";
import { useEffect, useState } from "react";
import getLocalDate from "../utils/getLocalDate";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import { Plus, Minus, Sparkles, TrendingUp, DollarSign, Calendar, Check, Search, MapPin } from "lucide-react";
import QuickProductModal from "./QuickProductModal";

function SaleForm({
    onSubmit,
    initialSale,
    isQuickModalOpen: externalIsQuickModalOpen,
    setIsQuickModalOpen: externalSetIsQuickModalOpen,
}) {
    const [internalIsQuickModalOpen, setInternalIsQuickModalOpen] = useState(false);
    const isQuickProductModalOpen =
        externalIsQuickModalOpen !== undefined
            ? externalIsQuickModalOpen
            : internalIsQuickModalOpen;
    const setIsQuickProductModalOpen =
        externalSetIsQuickModalOpen !== undefined
            ? externalSetIsQuickModalOpen
            : setInternalIsQuickModalOpen;

    const [sale, setSale] = useState(
        initialSale
            ? {
                ...initialSale,
                quantity: initialSale.quantity ?? 1,
                time: initialSale.time || new Date().toTimeString().slice(0, 5),
            }
            : {
                product: null,
                location: null,
                description: "",
                gross_amount: "",
                investment_amount: "",
                date: getLocalDate(),
                time: new Date().toTimeString().slice(0, 5),
                quantity: 1,
            }
    );

    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [productInput, setProductInput] = useState(
        initialSale?.description || ""
    );
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const normalizedInput = productInput.trim().toLowerCase();

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(normalizedInput)
    );

    const exactMatch = products.some(
        (product) => product.name.toLowerCase() === normalizedInput
    );

    const unitPrice =
        sale.quantity > 0 && Number(sale.gross_amount) > 0
            ? Number(sale.gross_amount) / sale.quantity
            : 0;

    const unitInvestment =
        sale.quantity > 0 && Number(sale.investment_amount) > 0
            ? Number(sale.investment_amount) / sale.quantity
            : 0;

    const totalProfit =
        Number(sale.gross_amount || 0) - Number(sale.investment_amount || 0);

    useEffect(() => {
        async function fetchData() {
            try {
                const [productsRes, locationsRes] = await Promise.all([
                    api.get("products/?sort=sales"),
                    api.get("locations/"),
                ]);
                setProducts(productsRes.data);
                setLocations(locationsRes.data);

                if (!initialSale && locationsRes.data.length > 0) {
                    const active = locationsRes.data.find((l) => l.is_active);
                    if (active) {
                        setSale((prev) => ({
                            ...prev,
                            location: active.id,
                        }));
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [initialSale]);


    function handleChange(event) {
        setSale({
            ...sale,
            [event.target.name]: event.target.value,
        });
    }

    function handleProductChange(event) {
        const value = event.target.value;
        setProductInput(value);
        setSale({
            ...sale,
            product: null,
            description: value,
        });
        setShowSuggestions(true);
    }

    function handleChipClick(product) {
        if (sale.product === product.id) {
            setSale((prev) => ({
                ...prev,
                product: null,
                description: "",
                gross_amount: "",
                investment_amount: "",
            }));
            setProductInput("");
            return;
        }
        selectProduct(product);
    }

    function selectProduct(product) {
        const rememberedPrice = product.price;
        const rememberedInvestment = product.investment_price;

        setSale({
            ...sale,
            product: product.id,
            description: product.name,
            gross_amount:
                rememberedPrice != null
                    ? String(Number(rememberedPrice) * sale.quantity)
                    : sale.gross_amount,
            investment_amount:
                rememberedInvestment != null
                    ? String(Number(rememberedInvestment) * sale.quantity)
                    : sale.investment_amount,
        });

        setProductInput(capitalizeWords(product.name));
        setShowSuggestions(false);
    }

    function handleProductCreated(newProduct) {
        setProducts((prev) => [newProduct, ...prev]);
        selectProduct(newProduct);
    }


    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(sale);
        } finally {
            setIsSubmitting(false);
        }
    }

    function updateQuantity(quantity) {
        const newQuantity = Math.max(1, quantity);
        const selectedProduct = products.find(
            (product) => product.id === sale.product
        );

        setSale({
            ...sale,
            quantity: newQuantity,
            gross_amount:
                selectedProduct?.price != null
                    ? String(Number(selectedProduct.price) * newQuantity)
                    : sale.gross_amount,
            investment_amount:
                selectedProduct?.investment_price != null
                    ? String(Number(selectedProduct.investment_price) * newQuantity)
                    : sale.investment_amount,
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">

            {/* Quick Pick Product Chips (Most Sold) */}
            {products.length > 0 && !initialSale && (
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--warning)]" />
                        <span>Más Vendidos</span>
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                        {products.slice(0, 10).map((prod) => {

                            const isSelected = sale.product === prod.id;
                            return (
                                <button
                                    key={prod.id}
                                    type="button"
                                    onClick={() => handleChipClick(prod)}
                                    className={`
                                        shrink-0
                                        rounded-xl
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        transition
                                        active-press
                                        border
                                        ${
                                            isSelected
                                                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                                : "bg-[var(--surface-accent)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--primary)]"
                                        }
                                    `}
                                >
                                    {capitalizeWords(prod.name)}
                                    {prod.price != null && (
                                        <span className={`ml-1.5 ${isSelected ? "text-white/80" : "text-[var(--text-secondary)]"}`}>
                                            ({formatCurrency(prod.price)})
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}


            {/* Product Name & Quantity Selector */}
            <div className="space-y-1.5">
                <div className="flex gap-2">
                    <label
                        htmlFor="product"
                        className="flex-1 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                        Producto
                    </label>
                    <label
                        htmlFor="quantity"
                        className="w-28 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                        Cantidad
                    </label>
                </div>

                <div className="flex gap-2.5">
                    <div className="relative flex-1">
                        <div className="relative">
                            <input
                                id="product"
                                type="text"
                                value={productInput}
                                onChange={handleProductChange}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() =>
                                    setTimeout(() => setShowSuggestions(false), 200)
                                }
                                placeholder="¿Qué vendiste?"
                                autoComplete="off"
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    px-4
                                    py-3
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
                        </div>

                        {showSuggestions && productInput.trim() && (
                            <div
                                className="
                                    absolute
                                    z-20
                                    mt-1.5
                                    w-full
                                    max-h-52
                                    overflow-y-auto
                                    rounded-2xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-1
                                    shadow-xl
                                "
                            >
                                {filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => selectProduct(product)}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-xs
                                            font-medium
                                            text-[var(--text-primary)]
                                            transition
                                            hover:bg-[var(--surface-accent)]
                                        "
                                    >
                                        <span className="font-semibold">{capitalizeWords(product.name)}</span>
                                        {product.price != null && (
                                            <span className="text-[var(--success)] font-bold">
                                                {formatCurrency(product.price)}
                                            </span>
                                        )}
                                    </button>
                                ))}

                                {!exactMatch && (
                                    <div className="border-t border-[var(--border)] p-1.5">
                                        <button
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => setIsQuickProductModalOpen(true)}
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                justify-between
                                                gap-2
                                                rounded-xl
                                                bg-[var(--surface-accent)]
                                                p-2.5
                                                text-left
                                                text-xs
                                                font-bold
                                                text-[var(--primary)]
                                                transition
                                                active-press
                                                hover:bg-[var(--primary)]
                                                hover:text-white
                                            "
                                        >
                                            <span className="flex items-center gap-1.5 truncate">
                                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                                <span>Crear "{capitalizeWords(productInput)}"</span>
                                            </span>
                                            <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider opacity-80">
                                                Fijar Precio
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    {/* Quantity Stepper (Thumb Ergonomic) */}
                    <div className="flex h-[46px] w-28 items-center justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-0.5">
                        <button
                            type="button"
                            aria-label="Disminuir cantidad"
                            onClick={() => updateQuantity(sale.quantity - 1)}
                            className="
                                flex
                                h-full
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                text-[var(--text-secondary)]
                                transition
                                active-press
                                hover:bg-[var(--surface-accent)]
                                hover:text-[var(--text-primary)]
                            "
                        >
                            <Minus className="w-4 h-4" />
                        </button>

                        <span className="text-sm font-extrabold text-[var(--text-primary)]">
                            {sale.quantity}
                        </span>

                        <button
                            type="button"
                            aria-label="Aumentar cantidad"
                            onClick={() => updateQuantity(sale.quantity + 1)}
                            className="
                                flex
                                h-full
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                text-[var(--text-secondary)]
                                transition
                                active-press
                                hover:bg-[var(--surface-accent)]
                                hover:text-[var(--text-primary)]
                            "
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Amounts Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Gross Amount */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="gross_amount"
                        className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                        Ingreso Bruto
                    </label>

                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[var(--text-secondary)]">
                            $
                        </span>

                        <input
                            id="gross_amount"
                            type="number"
                            name="gross_amount"
                            placeholder="0"
                            value={sale.gross_amount}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]
                                py-3
                                pl-7
                                pr-3
                                text-sm
                                font-bold
                                text-[var(--text-primary)]
                                outline-none
                                transition
                                focus:border-[var(--primary)]
                                focus:ring-2
                                focus:ring-[var(--primary)]/20
                            "
                        />
                    </div>
                    {unitPrice > 0 && sale.quantity > 1 && (
                        <p className="text-[11px] text-[var(--text-secondary)]">
                            {formatCurrency(unitPrice)} / u
                        </p>
                    )}
                </div>

                {/* Investment Amount */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="investment_amount"
                        className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                        Costo / Inversión
                    </label>

                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[var(--text-secondary)]">
                            $
                        </span>

                        <input
                            id="investment_amount"
                            type="number"
                            name="investment_amount"
                            placeholder="0"
                            value={sale.investment_amount}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]
                                py-3
                                pl-7
                                pr-3
                                text-sm
                                font-bold
                                text-[var(--text-primary)]
                                outline-none
                                transition
                                focus:border-[var(--primary)]
                                focus:ring-2
                                focus:ring-[var(--primary)]/20
                            "
                        />
                    </div>
                    {unitInvestment > 0 && sale.quantity > 1 && (
                        <p className="text-[11px] text-[var(--text-secondary)]">
                            {formatCurrency(unitInvestment)} / u
                        </p>
                    )}
                </div>
            </div>

            {/* Profit Live Preview Badge */}
            {Number(sale.gross_amount) > 0 && (
                <div className="flex items-center justify-between rounded-2xl border border-[var(--success-border)] bg-[var(--success-bg)] p-3 text-xs">
                    <div className="flex items-center gap-2 text-[var(--success-text)] font-bold">
                        <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                        <span>Ganancia estimada:</span>
                    </div>
                    <span className="text-base font-extrabold text-[var(--success)]">
                        +{formatCurrency(totalProfit)}
                    </span>
                </div>
            )}

            {/* Date Input */}
            <div className="space-y-1.5">
                <label
                    htmlFor="date"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                >
                    Fecha
                </label>

                <input
                    id="date"
                    type="date"
                    name="date"
                    value={sale.date}
                    onChange={handleChange}
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        px-4
                        py-2.5
                        text-xs
                        font-medium
                        text-[var(--text-primary)]
                        outline-none
                        transition
                        focus:border-[var(--primary)]
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                    "
                />
            </div>

            {/* Location Selector (Auto-selected to Active Location) */}
            {locations.length > 0 && (
                <div className="space-y-1.5">
                    <label
                        htmlFor="location"
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                        <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                        <span>Punto de Venta / Lugar</span>
                    </label>

                    <select
                        id="location"
                        name="location"
                        value={sale.location || ""}
                        onChange={(e) =>
                            setSale({
                                ...sale,
                                location: e.target.value ? Number(e.target.value) : null,
                            })
                        }
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            px-4
                            py-2.5
                            text-xs
                            font-medium
                            text-[var(--text-primary)]
                            outline-none
                            transition
                            focus:border-[var(--primary)]
                            focus:ring-2
                            focus:ring-[var(--primary)]/20
                        "
                    >
                        <option value="">Sin lugar específico</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                {capitalizeWords(loc.name)} {loc.is_active ? "● (Activo)" : ""}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Save Button */}
            <button

                disabled={isSubmitting || !sale.description.trim() || !sale.gross_amount}
                type="submit"
                className="
                    w-full
                    rounded-2xl
                    bg-[var(--primary)]
                    py-3.5
                    text-sm
                    font-extrabold
                    text-white
                    shadow-lg
                    shadow-[var(--primary)]/25
                    transition
                    active-press
                    hover:bg-[var(--primary-hover)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                {isSubmitting ? "Guardando venta..." : "✓ Registrar Venta"}
            </button>
        </form>

        {/* Quick Product Creation Modal (Rendered outside form to avoid nested form collision) */}
        <QuickProductModal
            isOpen={isQuickProductModalOpen}
            onClose={() => setIsQuickProductModalOpen(false)}
            initialName={productInput.trim()}
            onProductCreated={handleProductCreated}
        />
    </>
);
}

export default SaleForm;

