import api, { getApiError } from "../services/api";
import { useNavigate } from "react-router-dom";
import SaleForm from "../components/SaleForm";
import toast from "react-hot-toast";
import { ArrowLeft, Receipt } from "lucide-react";

function NewSale() {
    const navigate = useNavigate();

    async function handleCreateSale(sale) {
        try {
            await api.post("sales/", sale);
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
        <div className="min-h-screen px-4 pt-4 pb-12">
            <div className="mx-auto max-w-lg space-y-4">


                {/* Back Button & Header */}
                <div className="flex items-center gap-3 pt-safe">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
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
                        aria-label="Volver"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                            <span>Nueva Venta</span>
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Registra una operación al instante
                        </p>
                    </div>
                </div>

                {/* Main Form Card */}
                <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                    <SaleForm onSubmit={handleCreateSale} />
                </section>

            </div>
        </div>
    );
}

export default NewSale;