import api, { getApiError } from "../services/api";
import { useNavigate } from "react-router-dom";
import SaleForm from "../components/SaleForm";
import toast from "react-hot-toast";

function NewSale() {
    const navigate = useNavigate();

    async function handleCreateSale(sale) {
        try {
            const response = await api.post("sales/", sale);

            toast.success("Venta creada correctamente.");

            navigate("/");
        } catch (error) {
            console.error(error);

            toast.error(
                getApiError(error, "No se pudo crear la venta.")
            );
        }
    }

    return (
        <div className="min-h-screen bg-[var(--background)] px-4 py-8">
            <div className="mx-auto max-w-2xl space-y-6">

                <button
                    onClick={() => navigate(-1)}
                    className="
                        w-fit
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-[var(--text-secondary)]
                        transition
                        hover:bg-[var(--surface-accent)]
                    "
                >
                    ← Volver
                </button>

                <header>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Nueva Venta
                    </h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Registra una nueva venta.
                    </p>
                </header>

                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                    <SaleForm onSubmit={handleCreateSale} />
                </section>

            </div>
        </div>
    );
}

export default NewSale;