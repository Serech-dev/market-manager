import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import { X, Share2, Copy, Trophy, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { useCountUp } from "../hooks/useCountUp";


function DailySummaryModal({ isOpen, onClose, summary, sales, periodLabel }) {
    if (!isOpen) return null;

    const totalUnits = sales.reduce((sum, sale) => sum + (sale.quantity || 1), 0);

    // Calculate product breakdown for this period
    const productStats = {};
    sales.forEach((sale) => {
        const name = capitalizeWords(sale.product?.name || sale.description);
        if (!productStats[name]) {
            productStats[name] = { qty: 0, gross: 0, profit: 0 };
        }
        productStats[name].qty += sale.quantity || 1;
        productStats[name].gross += Number(sale.gross_amount || 0);
        productStats[name].profit += (Number(sale.gross_amount || 0) - Number(sale.investment_amount || 0));
    });

    const sortedProducts = Object.entries(productStats)
        .sort((a, b) => b[1].qty - a[1].qty)
        .slice(0, 5);

    const generateShareText = () => {
        let text = `🎉 *Resumen de Ventas - ${periodLabel}*\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `💰 *Ganancia Neta:* ${formatCurrency(summary.earnings)}\n`;
        text += `💵 *Total Recaudado:* ${formatCurrency(summary.gross)}\n`;
        text += `📦 *Costo/Inversión:* ${formatCurrency(summary.investment)}\n`;
        text += `🏷️ *Total Operaciones:* ${sales.length} (${totalUnits} unidades)\n`;
        
        if (sortedProducts.length > 0) {
            text += `\n🏆 *Top Productos:*\n`;
            sortedProducts.forEach(([name, data], idx) => {
                text += `${idx + 1}. ${name} (${data.qty} u) → ${formatCurrency(data.gross)}\n`;
            });
        }
        text += `━━━━━━━━━━━━━━━━━━━━━\n✨ *Market Manager*`;
        return text;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generateShareText());
            toast.success("¡Resumen copiado al portapapeles! 🎉");
        } catch (err) {
            toast.error("No se pudo copiar.");
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(generateShareText());
        window.open(`https://wa.me/?text=${text}`, "_blank");
    };

    const { displayValue: animatedEarnings, isBumping: isEarningsBumping } = useCountUp(summary.earnings, {
        startFromZero: true,
        duration: 1400,
    });
    const { displayValue: animatedGross } = useCountUp(summary.gross, {
        startFromZero: true,
        duration: 1200,
    });
    const { displayValue: animatedInvestment } = useCountUp(summary.investment, {
        startFromZero: true,
        duration: 1000,
    });

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-5 animate-pop-in">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20 animate-float">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
                                    Cierre de Jornada
                                </h2>
                                <span className="inline-flex items-center rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)]">
                                    ✨ Tally
                                </span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] capitalize">
                                {periodLabel}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)] transition active-press"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Metrics Card with Fanfare */}
                <div className={`rounded-3xl border border-[var(--success-border)] bg-[var(--success-bg)] p-5 text-center shadow-inner relative overflow-hidden transition-all duration-300 ${isEarningsBumping ? "ring-2 ring-[var(--success)]/40 scale-[1.01]" : ""}`}>
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--success-text)]">
                        <TrendingUp className="w-4 h-4" />
                        <span>Ganancia Neta del Período</span>
                    </div>
                    <p className={`mt-2 text-4xl font-black text-[var(--success-text)] tracking-tight transition-transform duration-200 ${isEarningsBumping ? "scale-105" : ""}`}>
                        +{formatCurrency(animatedEarnings)}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--success-border)]/60 pt-3 text-xs">
                        <div className="rounded-xl bg-white/40 p-2">
                            <span className="text-[var(--success-text)] block text-[10px] uppercase font-bold">Ingresos</span>
                            <span className="font-extrabold text-[var(--success-text)] text-sm">{formatCurrency(animatedGross)}</span>
                        </div>
                        <div className="rounded-xl bg-white/40 p-2">
                            <span className="text-[var(--success-text)] block text-[10px] uppercase font-bold">Inversión</span>
                            <span className="font-extrabold text-[var(--success-text)] text-sm">{formatCurrency(animatedInvestment)}</span>
                        </div>
                    </div>
                </div>



                {/* Operations & Units Badge */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)] p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Operaciones</p>
                        <p className="text-xl font-black text-[var(--text-primary)] mt-0.5">{sales.length}</p>
                    </div>
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)] p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Unidades Vendidas</p>
                        <p className="text-xl font-black text-[var(--text-primary)] mt-0.5">{totalUnits}</p>
                    </div>
                </div>

                {/* Top Selling Products */}
                {sortedProducts.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-[var(--warning)]" />
                            <span>Top Productos del Período</span>
                        </h3>
                        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                            {sortedProducts.map(([name, data], idx) => (
                                <div
                                    key={name}
                                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-accent)]/40 px-3.5 py-2 text-xs"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-extrabold text-white">
                                            {idx + 1}
                                        </span>
                                        <span className="font-bold text-[var(--text-primary)] truncate">{name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="font-bold text-[var(--text-secondary)]">{data.qty} u</span>
                                        <span className="font-bold text-[var(--text-primary)]">{formatCurrency(data.gross)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface-accent)]
                            py-3.5
                            text-xs
                            font-bold
                            text-[var(--text-primary)]
                            transition
                            active-press
                            hover:bg-[var(--surface)]
                        "
                    >
                        <Copy className="w-4 h-4" />
                        <span>Copiar Resumen</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-[#25D366]
                            py-3.5
                            text-xs
                            font-bold
                            text-white
                            shadow-md
                            shadow-[#25D366]/20
                            transition
                            active-press
                            hover:bg-[#1EBE5D]
                        "
                    >
                        <Share2 className="w-4 h-4" />
                        <span>Enviar WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DailySummaryModal;


