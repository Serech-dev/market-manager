import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getApiError } from "../services/api";
import { Package, DollarSign, Tags, X, Sparkles, Plus } from "lucide-react";

function QuickProductModal({ isOpen, onClose, initialName = "", onProductCreated }) {
    const [name, setName] = useState(initialName);
    const [price, setPrice] = useState("");
    const [investmentPrice, setInvestmentPrice] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setPrice("");
            setInvestmentPrice("");
            setCategory("");
            setIsCreatingCategory(false);
            fetchCategories();
        }
    }, [isOpen, initialName]);

    async function fetchCategories() {
        try {
            const response = await api.get("categories/");
            setCategories(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleCreateCategory(e) {
        e.preventDefault();
        e.stopPropagation();
        const trimmed = newCategoryName.trim();
        if (!trimmed) return;

        try {
            const response = await api.post("categories/", { name: trimmed });
            toast.success("Categoría creada.");
            setCategories((prev) => [...prev, response.data]);
            setCategory(response.data.id);
            setNewCategoryName("");
            setIsCreatingCategory(false);
        } catch (err) {
            toast.error(getApiError(err, "No se pudo crear la categoría."));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const trimmedName = name.trim();
        if (!trimmedName) {
            toast.error("El nombre del producto es obligatorio.");
            return;
        }


        if (!price || Number(price) <= 0) {
            toast.error("Ingresa un precio de venta válido.");
            return;
        }

        if (investmentPrice && Number(investmentPrice) > Number(price)) {
            toast.error("El costo no puede superar el precio de venta.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                name: trimmedName,
                price: Number(price),
                investment_price: investmentPrice ? Number(investmentPrice) : 0,
                category: category ? Number(category) : null,
            };

            const response = await api.post("products/", payload);
            toast.success("¡Producto creado!");
            onProductCreated(response.data);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(getApiError(err, "No se pudo crear el producto."));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl space-y-4 animate-pop-in">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-[var(--text-primary)]">
                                Crear Nuevo Producto
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)]">
                                Guardalo para registrar ventas en 1 toque
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)] transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                    
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Nombre del producto
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Aros Luna, Pulsera Plata..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            className="
                                w-full
                                rounded-xl
                                border
                                border-[var(--border)]
                                bg-[var(--background)]
                                px-3.5
                                py-2.5
                                text-sm
                                font-semibold
                                text-[var(--text-primary)]
                                outline-none
                                focus:border-[var(--primary)]
                                focus:ring-2
                                focus:ring-[var(--primary)]/20
                            "
                        />
                    </div>

                    {/* Price & Cost in 2 columns */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Selling Price */}
                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                Precio Venta ($)
                            </label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                placeholder="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-3.5
                                    py-2.5
                                    text-sm
                                    font-bold
                                    text-[var(--text-primary)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                    focus:ring-2
                                    focus:ring-[var(--primary)]/20
                                "
                            />
                        </div>

                        {/* Investment Cost */}
                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                Costo Unitario ($)
                            </label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                placeholder="0 (opcional)"
                                value={investmentPrice}
                                onChange={(e) => setInvestmentPrice(e.target.value)}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-3.5
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-[var(--text-primary)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                    focus:ring-2
                                    focus:ring-[var(--primary)]/20
                                "
                            />
                        </div>
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                Categoría (opcional)
                            </label>
                            {!isCreatingCategory && (
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingCategory(true)}
                                    className="text-[11px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    <span>Nueva categoría</span>
                                </button>
                            )}
                        </div>

                        {isCreatingCategory ? (
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="text"
                                    placeholder="Nombre de la categoría..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="
                                        flex-1
                                        rounded-xl
                                        border
                                        border-[var(--border)]
                                        bg-[var(--background)]
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-[var(--text-primary)]
                                        outline-none
                                        focus:border-[var(--primary)]
                                    "
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    className="rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--primary-hover)]"
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingCategory(false)}
                                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-3.5
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    text-[var(--text-primary)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                    focus:ring-2
                                    focus:ring-[var(--primary)]/20
                                "
                            >
                                <option value="">Sin categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] transition active-press"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim() || !price}
                            className="
                                rounded-xl
                                bg-[var(--primary)]
                                px-5
                                py-2.5
                                text-xs
                                font-extrabold
                                text-white
                                shadow-md
                                shadow-[var(--primary)]/25
                                transition
                                active-press
                                hover:bg-[var(--primary-hover)]
                                disabled:opacity-50
                            "
                        >
                            {isSubmitting ? "Guardando..." : "Crear y Seleccionar"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default QuickProductModal;

