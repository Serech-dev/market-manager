import { useNavigate, useParams } from "react-router-dom";
import SaleForm from "../components/SaleForm";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

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
            });
    }, [id]);

    async function handleUpdateSale(updatedSale) {
        try {
            await api.patch(`sales/${id}/`, updatedSale);

            toast.success("Venta actualizada.");

            navigate("/");
        }
        catch (error) {
            console.error(error);

            if (error.response?.status === 400) {
                toast.error("Verifique el monto ingresado.");
                return;
            }

            toast.error("Ocurrió un error inesperado.");
        }
    }

    if (!sale) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <p className="text-[var(--text-secondary)]">
                    Cargando venta...
                </p>
            </div>
        );
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
                        Editar Venta
                    </h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Actualiza la información de la venta.
                    </p>
                </header>

                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
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