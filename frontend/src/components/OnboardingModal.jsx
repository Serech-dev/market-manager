import { useState } from "react";
import { Sparkles, ShoppingBag, MapPin, TrendingUp, ChevronRight, Check, Share2, Flame } from "lucide-react";

const SLIDES = [
    {
        icon: ShoppingBag,
        badge: "Paso 1 de 3",
        title: "Venta Rápida sin Enredos",
        subtitle: "Pensado para la velocidad del mostrador y la feria",
        description:
            "Elegí tus productos más vendidos en un toque o creá uno nuevo fijando su precio unitario. Podés aumentar cantidades (+ y -) y el total se calculará de forma automática y transparente.",
        preview: (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                    <span className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--primary)] text-white text-[10px]">
                            2x
                        </span>
                        Aros Luna
                    </span>
                    <span className="text-[var(--success)]">+$5.000</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] border-t border-[var(--border)]/60 pt-1.5">
                    <span>$2.500 / unidad</span>
                    <span className="font-extrabold text-[var(--text-primary)]">Total: $5.000</span>
                </div>
            </div>
        ),
    },
    {
        icon: MapPin,
        badge: "Paso 2 de 3",
        title: "Puntos de Venta (Lugares)",
        subtitle: "Configuralo una vez al llegar y olvidate",
        description:
            "En la pestaña 'Lugares' activá la feria, showroom o local donde estés vendiendo hoy. Las nuevas ventas se guardarán automáticamente en ese lugar para saber dónde vendés más.",
        preview: (
            <div className="rounded-2xl border border-[var(--primary)]/40 bg-[var(--surface-accent)] p-3.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                        <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary)] block">
                            Punto de Venta Activo
                        </span>
                        <p className="text-xs font-extrabold text-[var(--text-primary)]">
                            Feria Plaza Palermo
                        </p>
                    </div>
                </div>
                <span className="rounded-full bg-[var(--primary)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)]">
                    ● Activo
                </span>
            </div>
        ),
    },
    {
        icon: Sparkles,
        badge: "Paso 3 de 3",
        title: "Cierre de Jornada y Análisis Completo",
        subtitle: "Balance instantáneo y estadísticas detalladas",
        description:
            "Al finalizar, tocá 'Cierre del Día' para ver tu balance y festejar. Podés alternar entre el Resumen rápido y el Análisis Completo, y compartir el reporte por WhatsApp con un solo toque.",
        preview: (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/60 p-3.5 space-y-2.5">
                {/* Segmented view switcher preview */}
                <div className="flex rounded-xl bg-[var(--surface)] p-1 border border-[var(--border)] text-[10px] font-bold">
                    <span className="flex-1 text-center py-1 rounded-lg text-[var(--text-secondary)]">
                        ✨ Resumen
                    </span>
                    <span className="flex-1 text-center py-1 rounded-lg bg-[var(--primary)] text-white shadow-xs">
                        📊 Análisis Completo
                    </span>
                </div>

                {/* Stat badges preview */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-[var(--success-border)] bg-[var(--success-bg)] p-2">
                        <span className="text-[10px] font-bold text-[var(--success-text)] flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-[var(--success)]" /> Ganancia
                        </span>
                        <span className="text-xs font-black text-[var(--success)]">+$45.000</span>
                    </div>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[var(--primary)]" /> Hora Pico
                        </span>
                        <span className="text-xs font-black text-[var(--text-primary)]">17:00 hs</span>
                    </div>
                </div>

                {/* WhatsApp button preview */}
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--surface)] py-1.5 px-2 text-[11px] font-bold text-[var(--text-primary)] border border-[var(--border)]">
                    <Share2 className="w-3 h-3 text-[var(--success)]" />
                    <span>Compartir Reporte en WhatsApp</span>
                </div>
            </div>
        ),
    },
];

function OnboardingModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [dontShowAgain, setDontShowAgain] = useState(
        () => localStorage.getItem("dont_show_guide_v1") === "true"
    );

    if (!isOpen) return null;

    const isLastSlide = currentStep === SLIDES.length - 1;
    const slide = SLIDES[currentStep];
    const IconComponent = slide.icon;

    function toggleDontShowAgain() {
        const nextVal = !dontShowAgain;
        setDontShowAgain(nextVal);
        if (nextVal) {
            localStorage.setItem("dont_show_guide_v1", "true");
        } else {
            localStorage.removeItem("dont_show_guide_v1");
        }
    }

    function handleClose() {
        if (dontShowAgain) {
            localStorage.setItem("dont_show_guide_v1", "true");
        }
        onClose();
    }

    function handleNext() {
        if (isLastSlide) {
            handleClose();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-5 animate-pop-in">
                
                {/* Top Row: Step Badge & Skip Button */}
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/15 px-3 py-1 text-xs font-extrabold text-[var(--primary)]">
                        <IconComponent className="w-3.5 h-3.5" />
                        {slide.badge}
                    </span>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition p-1 active-press"
                    >
                        Saltar
                    </button>
                </div>

                {/* Content Header */}
                <div className="space-y-1.5">
                    <h2 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                        {slide.title}
                    </h2>
                    <p className="text-xs font-semibold text-[var(--primary)]">
                        {slide.subtitle}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                        {slide.description}
                    </p>
                </div>

                {/* Visual Preview Card */}
                {slide.preview}

                {/* Footer Controls */}
                <div className="pt-2 space-y-3">
                    {/* Pagination Dots & Next/Back CTA */}
                    <div className="flex items-center justify-between">
                        {/* Dots */}
                        <div className="flex items-center gap-1.5">
                            {SLIDES.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setCurrentStep(index)}
                                    aria-label={`Ir al paso ${index + 1}`}
                                    className={`
                                        h-2 rounded-full transition-all duration-300
                                        ${
                                            index === currentStep
                                                ? "w-6 bg-[var(--primary)]"
                                                : "w-2 bg-[var(--border)] hover:bg-[var(--text-secondary)]"
                                        }
                                    `}
                                />
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-2">
                            {currentStep > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep((prev) => prev - 1)}
                                    className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] transition active-press"
                                >
                                    Atrás
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleNext}
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    rounded-xl
                                    bg-[var(--primary)]
                                    px-4
                                    py-2
                                    text-xs
                                    font-extrabold
                                    text-white
                                    shadow-md
                                    shadow-[var(--primary)]/25
                                    transition
                                    active-press
                                    hover:bg-[var(--primary-hover)]
                                "
                            >
                                <span>{isLastSlide ? "¡Empezar a vender!" : "Siguiente"}</span>
                                {isLastSlide ? (
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : (
                                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Don't show again custom toggle switch */}
                    <div className="flex items-center justify-between border-t border-[var(--border)]/60 pt-2.5">
                        <button
                            type="button"
                            onClick={toggleDontShowAgain}
                            className="flex items-center gap-2.5 text-left cursor-pointer group select-none active-press"
                            role="switch"
                            aria-checked={dontShowAgain}
                        >
                            <div
                                className={`
                                    relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out
                                    ${dontShowAgain ? "bg-[var(--primary)]" : "bg-[var(--border)]"}
                                `}
                            >
                                <div
                                    className={`
                                        h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out
                                        ${dontShowAgain ? "translate-x-4" : "translate-x-0"}
                                    `}
                                />
                            </div>
                            <span className="text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition">
                                No volver a mostrar al iniciar
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default OnboardingModal;

