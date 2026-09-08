import { useState } from "react";
import api, { getApiError } from "../services/api";
import { useNavigate } from "react-router-dom";
import SaleForm from "../components/SaleForm";
import toast from "react-hot-toast";
import { ArrowLeft, Plus } from "lucide-react";
import { playSaleSuccessSound, playPopSound } from "../utils/soundEffects";
import { isBambiEnabled, getRandomBambiPhrase } from "../utils/bambiConfig";

const BAMBI_ADVICES = [
    "Vendé más mamá!",
    "Anotá todo bien prolijo",
    "Claro que si mamá!",
    "Buenoestábien.",
    "Anotando cada detalle...",
    "¡Metanle pata con las ventas!",
    "Todo registrado, todo controlado.",
    "El cliente siempre tiene la razón (a veces).",
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

                {/* Bambi Asistente Recomienda Banner */}
                {isBambiEnabled() && (
                    <div
                        onClick={cycleAdvice}
                        role="button"
                        tabIndex={0}
                        title="Tocá para otro consejo de Bambi"
                        className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                            rounded-3xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            p-5
                            shadow-sm
                            transition-all
                            cursor-pointer
                            active-press
                            hover:border-[var(--primary)]/40
                            hover:shadow-md
                            group
                        "
                    >
                        <div className="relative h-28 w-28 sm:h-36 sm:w-36 transition-transform group-hover:scale-105 mb-2">
                            <img
                                src="/bambi/bambianotando.webp"
                                alt="Bambi asistente"
                                className="h-full w-full object-contain filter drop-shadow-sm select-none pointer-events-none"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <span className="inline-block h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
                            <p className="text-[11px] font-black uppercase tracking-wider text-[var(--primary)]">
                                Bambi asistente recomienda
                            </p>
                        </div>

                        <p className="text-sm sm:text-base font-black text-[var(--text-primary)] leading-snug max-w-sm">
                            "{BAMBI_ADVICES[adviceIndex]}"
                        </p>

                        <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-1.5 opacity-70">
                            Tocá para otro consejo
                        </p>
                    </div>
                )}

                {/* Main Form Card */}
                <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
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

