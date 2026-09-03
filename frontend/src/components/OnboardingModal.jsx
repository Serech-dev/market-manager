import { useState } from "react";
import { Sparkles, ShoppingBag, MapPin, TrendingUp, ChevronRight, Check, X, Share2 } from "lucide-react";

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
        title: "Cierre del Día Instantáneo",
        subtitle: "Tu balance listo al terminar la jornada",
        description:
            "Tocá 'Cierre del Día' en la pantalla principal para ver tus ingresos brutos, costos y ganancia neta. Podés compartir el balance directo a WhatsApp con un solo botón.",
        preview: (
            <div className="rounded-2xl border border-[var(--success-border)] bg-[var(--success-bg)] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--success-text)] flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                        Ganancia Neta
                    </span>
                    <span className="text-base font-extrabold text-[var(--success)]">+$45.000</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--surface)] p-2 text-xs font-bold text-[var(--text-primary)] border border-[var(--border)]">
                    <Share2 className="w-3.5 h-3.5 text-[var(--success)]" />
                    <span>Compartir por WhatsApp</span>
                </div>
            </div>
        ),
    },
];

function OnboardingModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const isLastSlide = currentStep === SLIDES.length - 1;
    const slide = SLIDES[currentStep];
    const IconComponent = slide.icon;

    function handleNext() {
        if (isLastSlide) {
            handleFinish();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    }

    function handleFinish() {
        localStorage.setItem("has_seen_guide_v1", "true");
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-5 animate-pop-in">
                
                {/* Top Row: Step Badge & Skip Button */}
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/15 px-3 py-1 text-xs font-extrabold text-[var(--primary)]">
                        <IconComponent className="w-3.5 h-3.5" />
                        {slide.badge}
                    </span>

                    <button
                        type="button"
                        onClick={handleFinish}
                        className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition p-1"
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

                {/* Footer Controls: Pagination Dots & CTA */}
                <div className="flex items-center justify-between pt-2">
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

                    {/* Next / Start Button */}
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

            </div>
        </div>
    );
}

export default OnboardingModal;

