import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getApiError } from "../services/api";

function NewProduct() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setIsSubmitting(true);
        setError("");

        try {
            await api.post("products/", {
                name,
            });

            navigate("/products");
        } catch (error) {
            console.error(error);

            setError(
                getApiError(
                    error,
                    "No se pudo crear el producto."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--surface)] px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">

                <header className="min-h-[72px]">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Nuevo producto
                    </h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Agrega un producto al registro
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="
                        max-w-xl
                        rounded-2xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-6
                        shadow-sm
                    "
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-[var(--text-primary)]"
                        >
                            Nombre
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Ej. Collar"
                            autoFocus
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

                    {error && (
                        <p className="mt-3 text-sm text-[var(--danger)]">
                            {error}
                        </p>
                    )}

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="
                                flex-1
                                rounded-xl
                                border
                                border-[var(--border)]
                                px-4
                                py-3
                                font-semibold
                                text-[var(--text-primary)]
                                transition
                                hover:bg-[var(--background)]
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="
                                flex-1
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
                                disabled:opacity-50
                            "
                        >
                            {isSubmitting ? "Guardando..." : "Crear producto"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default NewProduct;