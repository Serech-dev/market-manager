import { useState } from "react";
import api, { getApiError } from "../services/api";
import toast from "react-hot-toast";
import { capitalizeWords } from "../utils/capitalizeWords";
import { Tags, X, Check, Loader2 } from "lucide-react";
import CategoryCombobox from "./CategoryCombobox";

function BulkCategorizeModal({
    isOpen,
    onClose,
    selectedProductIds = [],
    selectedProducts = [],
    categories = [],
    onSuccess,
}) {
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        if (selectedProductIds.length === 0 || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await api.post("products/bulk-categorize/", {
                product_ids: selectedProductIds,
                category_id: selectedCategoryId || null,
            });

            const count = response.data.updated_count;
            const catName = response.data.category_name;

            toast.success(
                catName
                    ? `${count} producto${count > 1 ? "s" : ""} asignado${count > 1 ? "s" : ""} a "${capitalizeWords(catName)}".`
                    : `${count} producto${count > 1 ? "s" : ""} sin categoría.`
            );

            if (onSuccess) {
                onSuccess({
                    updatedCount: count,
                    categoryId: response.data.category_id,
                    categoryName: catName,
                });
            }

            onClose();
        } catch (err) {
            console.error(err);
            toast.error(getApiError(err, "No se pudieron categorizar los productos."));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl space-y-4 animate-pop-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20">
                            <Tags className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-[var(--text-primary)]">
                                Asignar Categoría
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)]">
                                {selectedProductIds.length} producto{selectedProductIds.length > 1 ? "s" : ""} seleccionado{selectedProductIds.length > 1 ? "s" : ""}
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

                {/* Selected Products Preview (compact chips) */}
                {selectedProducts.length > 0 && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/40 p-3 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Productos a actualizar:
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                            {selectedProducts.map((p) => (
                                <span
                                    key={p.id}
                                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--text-primary)] shadow-2xs"
                                >
                                    {capitalizeWords(p.name)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Selection Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Seleccionar o Crear Categoría
                        </label>
                        <CategoryCombobox
                            selectedCategoryId={selectedCategoryId}
                            onSelectCategory={(catId, catName) => {
                                setSelectedCategoryId(catId);
                                setSelectedCategoryName(catName);
                            }}
                            categories={categories}
                            placeholder="Buscar o escribir nueva categoría..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] transition active-press"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || selectedProductIds.length === 0}
                            className="
                                flex
                                items-center
                                gap-1.5
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
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>Aplicar a {selectedProductIds.length}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BulkCategorizeModal;
