import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api, { getApiError } from "../services/api";
import { ArrowLeft, Tags, Plus } from "lucide-react";

function NewCategory() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            await api.post("categories/", {
                name,
            });

            toast.success("Categoría creada.");
            navigate("/categories");
        } catch (err) {
            console.error(err);
            setError(
                getApiError(
                    err,
                    "No se pudo crear la categoría."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen px-4 pt-4 pb-12">
            <div className="mx-auto max-w-lg space-y-4">


                {/* Header with Back button */}
                <div className="flex items-center gap-3 pt-safe">
                    <button
                        type="button"
                        onClick={() => navigate("/categories")}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            text-[var(--text-secondary)]
                            transition
                            active-press
                            hover:bg-[var(--surface-accent)]
                            hover:text-[var(--text-primary)]
                        "
                        aria-label="Volver a categorías"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                            Nueva Categoría
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Organiza tus productos por tipo
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="
                        rounded-3xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-5
                        shadow-sm
                        space-y-4
                    "
                >
                    <div className="space-y-1.5">
                        <label
                            htmlFor="category-name"
                            className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                        >
                            Nombre de la categoría
                        </label>

                        <input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Ej. Maquillaje, Accesorios, Indumentaria"
                            autoFocus
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

                    {error && (
                        <p className="text-xs font-medium text-[var(--danger)]">
                            {error}
                        </p>
                    )}

                    <div className="pt-2 flex gap-2.5">
                        <button
                            type="button"
                            onClick={() => navigate("/categories")}
                            className="
                                flex-1
                                rounded-2xl
                                border
                                border-[var(--border)]
                                bg-[var(--surface-accent)]
                                py-3
                                text-xs
                                font-bold
                                text-[var(--text-primary)]
                                transition
                                active-press
                                hover:bg-[var(--surface)]
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="
                                flex-1
                                rounded-2xl
                                bg-[var(--primary)]
                                py-3
                                text-xs
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
                            {isSubmitting ? "Creando..." : "Crear Categoría"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default NewCategory;
