import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api, { getApiError } from "../services/api";

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
            navigate("/products");
        } catch (error) {
            console.error(error);

            setError(
                getApiError(
                    error,
                    "No se pudo crear la categoría."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--background)] px-4 py-8">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-md">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Nueva categoría
                    </h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Crea una categoría para organizar tus productos.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="
                            mt-6
                            space-y-5
                            rounded-2xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            p-5
                            shadow-sm
                        "
                    >
                        <div>
                            <label
                                htmlFor="category-name"
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-[var(--text-primary)]
                                "
                            >
                                Nombre
                            </label>

                            <input
                                id="category-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                className="
                                    mt-1
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
                                placeholder="Ej. Bebidas"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-[var(--danger)]">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                className="
                                    rounded-xl
                                    border
                                    border-[var(--border)]
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-[var(--text-primary)]
                                    transition
                                    hover:bg-[var(--surface-accent)]
                                "
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="
                                    rounded-xl
                                    bg-[var(--primary)]
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-[var(--primary-hover)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {isSubmitting
                                    ? "Creando..."
                                    : "Crear categoría"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewCategory;