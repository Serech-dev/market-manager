import { useEffect, useState } from "react";
import api from "../services/api";


function formatProductName(name) {
    return name
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}


function SaleForm({ onSubmit, initialSale }) {
    const [sale, setSale] = useState(
        initialSale || {
            product: null,
            description: "",
            gross_amount: "",
            investment_amount: "",
            date: new Date().toISOString().split("T")[0],
        }
    );

    const [products, setProducts] = useState([]);
    const [productInput, setProductInput] = useState(
        initialSale?.description || ""
    );
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get("products/");
                setProducts(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProducts();
    }, []);

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

    function selectProduct(product) {
        setSale({
            ...sale,
            product: product.id,
            description: product.name,
        });

        setProductInput(formatProductName(product.name));
        setShowSuggestions(false);
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

    const normalizedInput = productInput.trim().toLowerCase();

    const filteredProducts = products.filter((product) =>
        product.name.includes(normalizedInput)
    );

    const exactMatch = products.some(
        (product) => product.name === normalizedInput
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div className="space-y-2">
                <label
                    htmlFor="product"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                >
                    Producto
                </label>

                <div className="relative">
                    <input
                        id="product"
                        type="text"
                        value={productInput}
                        onChange={handleProductChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() =>
                            setTimeout(
                                () => setShowSuggestions(false),
                                150
                            )
                        }
                        placeholder="¿Qué vendiste?"
                        autoComplete="off"
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

                    {showSuggestions && productInput.trim() && (
                        <div
                            className="
                                absolute
                                z-10
                                mt-2
                                w-full
                                overflow-hidden
                                rounded-xl
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]
                                shadow-lg
                            "
                        >
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onMouseDown={(e) =>
                                        e.preventDefault()
                                    }
                                    onClick={() =>
                                        selectProduct(product)
                                    }
                                    className="
                                        block
                                        w-full
                                        px-4
                                        py-3
                                        text-left
                                        text-[var(--text-primary)]
                                        transition
                                        hover:bg-[var(--surface-accent)]
                                    "
                                >
                                    {formatProductName(product.name)}
                                </button>
                            ))}

                            {!exactMatch && (
                                <div
                                    className="
                                        border-t
                                        border-[var(--border)]
                                        px-4
                                        py-3
                                        text-sm
                                        text-[var(--text-secondary)]
                                    "
                                >
                                    Se creará un nuevo producto:
                                    <span className="ml-1 font-medium text-[var(--text-primary)]">
                                        {formatProductName(productInput)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="gross_amount"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                >
                    Ingreso Bruto
                </label>

                <div className="relative">
                    <span
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            font-medium
                            text-[var(--text-secondary)]
                        "
                    >
                        $
                    </span>

                    <input
                        id="gross_amount"
                        type="number"
                        name="gross_amount"
                        value={sale.gross_amount}
                        onChange={handleChange}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            py-3
                            pl-8
                            pr-4
                            text-[var(--text-primary)]
                            outline-none
                            transition
                            focus:border-[var(--primary)]
                            focus:ring-2
                            focus:ring-[var(--primary)]/20
                        "
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="investment_amount"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                >
                    Inversión
                </label>

                <div className="relative">
                    <span
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            font-medium
                            text-[var(--text-secondary)]
                        "
                    >
                        $
                    </span>

                    <input
                        id="investment_amount"
                        type="number"
                        name="investment_amount"
                        value={sale.investment_amount}
                        onChange={handleChange}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            py-3
                            pl-8
                            pr-4
                            text-[var(--text-primary)]
                            outline-none
                            transition
                            focus:border-[var(--primary)]
                            focus:ring-2
                            focus:ring-[var(--primary)]/20
                        "
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="date"
                    className="block text-sm font-medium text-[var(--text-primary)]"
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
            </div>

            <button
                disabled={isSubmitting}
                type="submit"
                className="
                    w-full
                    rounded-xl
                    bg-[var(--primary)]
                    px-4
                    py-3
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[var(--primary-hover)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >
                {isSubmitting ? "Guardando..." : "Guardar Venta"}
            </button>
        </form>
    );
}

export default SaleForm;