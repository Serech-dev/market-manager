import { useState } from "react";
import api, { getApiError } from "../services/api";
import { useNavigate } from "react-router-dom";
import SaleForm from "../components/SaleForm";
import toast from "react-hot-toast";
import { ArrowLeft, Plus } from "lucide-react";
import { playSaleSuccessSound } from "../utils/soundEffects";
import { isBambiEnabled, getRandomBambiPhrase } from "../utils/bambiConfig";

const BAMBI_ADVICES = [
    "Vendé más mamá!",
    "Anotá todo bien prolijo",
    "Claro que si mamá!",
    "Buenoestábien.",
    "Anotando cada detalle...",
];

function NewSale() {
    const navigate = useNavigate();
    const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
    const [adviceIndex, setAdviceIndex] = useState(0);

    function cycleAdvice() {
        playPopSound();
        setAdviceIndex((prev) => (prev + 1) % BAMBI_ADVICES.length);
    }

    async function handleCreateSale(sale) {
        try {
            await api.post("sales/", sale);
            playSaleSuccessSound();
            if (isBambiEnabled()) {
                const quote = getRandomBambiPhrase("sale");
                toast.success(quote);
            } else {
                toast.success("Venta creada correctamente.");
            }
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
                <div className="flex items-center justify-between gap-3 pt-safe">
                    <div className="flex items-center gap-3 min-w-0">
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
                                shrink-0
                            "
                            aria-label="Volver"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <div className="min-w-0">
                            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] truncate">
                                Nueva Venta
                            </h1>
                            <p className="text-xs text-[var(--text-secondary)] truncate">
                                Registra una operación al instante
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsQuickModalOpen(true)}
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-xl
                            bg-[var(--primary)]
                            px-3
                            py-2
                            text-xs
                            font-bold
                            text-white
                            shadow-sm
                            transition
                            active-press
                            hover:bg-[var(--primary-hover)]
                        "
                    >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Nuevo Producto</span>
                    </button>
                </div>

                {/* Main Form Card with Overlapping Peeking Bambi */}
                <section className={`relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm ${isBambiEnabled() ? "mt-9 pt-7" : ""}`}>
                    {isBambiEnabled() && (
                        <div
                            onClick={cycleAdvice}
                            title="Tocá para otro consejo de Bambi"
                            className="absolute -top-7 sm:-top-8 left-3 sm:left-6 flex items-end gap-2.5 z-10 cursor-pointer active-press group"
                        >
                            <div className="relative h-18 w-18 sm:h-22 sm:w-22 shrink-0 transition-transform group-hover:scale-105">
                                <img
                                    src="/bambi/bambianotando.webp"
                                    alt="Bambi asistente"
                                    className="h-full w-full object-contain filter drop-shadow-sm select-none pointer-events-none"
                                />
                            </div>
                            <div className="mb-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-3 py-1.5 shadow-md transition-all group-hover:border-[var(--primary)]/50">
                                <p className="text-[9px] font-black uppercase tracking-wider text-[var(--primary)]">
                                    Bambi asistente recomienda:
                                </p>
                                <p className="text-xs sm:text-sm font-black text-[var(--text-primary)] leading-tight">
                                    "{BAMBI_ADVICES[adviceIndex]}"
                                </p>
                            </div>
                        </div>
                    )}

                    <SaleForm
                        onSubmit={handleCreateSale}
                        isQuickModalOpen={isQuickModalOpen}
                        setIsQuickModalOpen={setIsQuickModalOpen}
                    />
                </section>

            </div>
        </div>
    );
}

export default NewSale;

