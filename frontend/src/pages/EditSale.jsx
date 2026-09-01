import { useNavigate, useParams } from "react-router-dom";
import SaleForm from "../components/SaleForm";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getApiError } from "../services/api";
import { ArrowLeft, Edit3 } from "lucide-react";

function EditSale() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sale, setSale] = useState(null);

    useEffect(() => {
        api.get(`sales/${id}`)
            .then((response) => {
                setSale(response.data);
            })
            .catch((error) => {
                console.error(error);
                toast.error("No se pudo cargar la venta.");
            });
    }, [id]);

    async function handleUpdateSale(updatedSale) {
        try {
            await api.patch(`sales/${id}/`, updatedSale);
            toast.success("Venta actualizada.");
            navigate("/");
        } catch (error) {
            console.error(error);
            if (error.response?.status === 400) {
                toast.error("Verifique el monto ingresado.");
                return;
            }
            toast.error(getApiError(error, "Ocurrió un error inesperado."));
        }
    }

    if (!sale) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-ping" />
                    <span>Cargando venta...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 pt-4 pb-12">
            <div className="mx-auto max-w-lg space-y-4">


                {/* Header with Back Button */}
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
                            <span>Editar Venta</span>
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Modifica los datos de la operación
                        </p>
                    </div>
                </div>

                <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                    <SaleForm
                        initialSale={sale}
                        onSubmit={handleUpdateSale}
                    />
                </section>

            </div>
        </div>
    );
}

export default EditSale;