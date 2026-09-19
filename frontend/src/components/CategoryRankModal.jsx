import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import {
    X,
    Trophy,
    Sparkles,
    TrendingUp,
    Crown,
    Tags,
    Percent,
    Share2,
    Copy,
    Award,
    ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { triggerConfetti, playFanfareSound } from "../utils/soundEffects";
import { usePrivacy } from "../context/PrivacyContext";

function CategoryRankModal({
    isOpen,
    onClose,
    categories = [],
    periodLabel = "",
}) {
    const { isPrivate } = usePrivacy();
    const [rankBy, setRankBy] = useState("earnings"); // "earnings" | "gross" | "sales" | "margin"

    useEffect(() => {
        if (isOpen) {
            triggerConfetti();
            playFanfareSound();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const safeCategories = (categories || []).filter((c) => Number(c.gross || 0) > 0 || Number(c.sales_count || 0) > 0);

    const totalGross = safeCategories.reduce((sum, c) => sum + Number(c.gross || 0), 0);
    const totalEarnings = safeCategories.reduce((sum, c) => sum + Number(c.earnings || 0), 0);
    const totalSales = safeCategories.reduce((sum, c) => sum + Number(c.sales_count || 0), 0);

    // Sorting
    const sortedCategories = [...safeCategories].sort((a, b) => {
        if (rankBy === "gross") {
            return Number(b.gross || 0) - Number(a.gross || 0);
        }
        if (rankBy === "sales") {
            return Number(b.sales_count || 0) - Number(a.sales_count || 0);
        }
        if (rankBy === "margin") {
            return (b.margin_percentage || 0) - (a.margin_percentage || 0);
        }
        return Number(b.earnings || 0) - Number(a.earnings || 0);
    });

    const topCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;
    const topCategoryShare =
        topCategory && totalGross > 0
            ? Math.round((Number(topCategory.gross || 0) / totalGross) * 100)
            : 0;

    function handleShare() {
        const lines = [
            `🏆 *Ranking de Categorías - Market Manager*`,
            periodLabel ? `📅 Período: ${periodLabel}` : "",
            `💰 Ingresos Totales: ${formatCurrency(totalGross, { isPrivate })}`,
            `✨ Ganancia Total: ${formatCurrency(totalEarnings, { isPrivate })}`,
            `📦 Ventas Totales: ${totalSales}`,
            "",
            "📊 *Rendimiento por Categoría:*",
            ...sortedCategories.map((c, i) => {
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
                return `${medal} *${capitalizeWords(c.name)}*: ${formatCurrency(c.earnings, { isPrivate })} ganancia (${c.sales_count} ventas - ${c.margin_percentage || 0}% margen)`;
            }),
        ].filter(Boolean);

        const text = lines.join("\n");

        if (navigator.share) {
            navigator.share({ title: "Ranking de Categorías", text }).catch(() => {});
        } else {
            navigator.clipboard.writeText(text);
            toast.success("Ranking copiado al portapapeles.");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-in">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-pop-in">
                
                {/* Header */}
                <div className="relative border-b border-[var(--border)] bg-[var(--surface-accent)]/30 p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--warning)] text-white shadow-md shadow-[var(--warning)]/20">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
                                    Ranking de Categorías
                                </h2>
                                <p className="text-xs font-medium text-[var(--text-secondary)] capitalize">
                                    {periodLabel || "Resumen de rendimiento"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleShare}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xs hover:bg-[var(--surface-accent)] active-press transition"
                                title="Compartir ranking"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)] active-press transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Champion Hero Card */}
                    {topCategory && (
                        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--warning)]/40 bg-[var(--surface)] p-3.5 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                                    <Crown className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                                        Categoría Líder
                                    </span>
                                    <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                                        {capitalizeWords(topCategory.name)}
                                    </h3>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-xs font-bold text-[var(--success)]">
                                    +{formatCurrency(topCategory.earnings, { isPrivate })}
                                </span>
                                <p className="text-[10px] font-semibold text-[var(--text-secondary)]">
                                    {topCategoryShare}% de tus ingresos
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Metric Sorter Tabs */}
                <div className="flex gap-1 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 overflow-x-auto no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setRankBy("earnings")}
                        className={`
                            shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition active-press border
                            ${
                                rankBy === "earnings"
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs"
                                    : "bg-[var(--surface-accent)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
                            }
                        `}
                    >
                        💰 Mayor Ganancia
                    </button>

                    <button
                        type="button"
                        onClick={() => setRankBy("gross")}
                        className={`
                            shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition active-press border
                            ${
                                rankBy === "gross"
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs"
                                    : "bg-[var(--surface-accent)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
                            }
                        `}
                    >
                        📈 Mayor Ingreso
                    </button>

                    <button
                        type="button"
                        onClick={() => setRankBy("sales")}
                        className={`
                            shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition active-press border
                            ${
                                rankBy === "sales"
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs"
                                    : "bg-[var(--surface-accent)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
                            }
                        `}
                    >
                        📦 Más Ventas
                    </button>

                    <button
                        type="button"
                        onClick={() => setRankBy("margin")}
                        className={`
                            shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition active-press border
                            ${
                                rankBy === "margin"
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs"
                                    : "bg-[var(--surface-accent)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
                            }
                        `}
                    >
                        🎯 Mejor Margen
                    </button>
                </div>

                {/* Ranked List Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
                    {sortedCategories.length === 0 ? (
                        <div className="p-8 text-center space-y-2">
                            <Tags className="mx-auto w-8 h-8 text-[var(--text-secondary)]" />
                            <p className="text-xs font-semibold text-[var(--text-secondary)]">
                                No hay ventas registradas con categorías en este período.
                            </p>
                        </div>
                    ) : (
                        sortedCategories.map((category, index) => {
                            const isGold = index === 0;
                            const isSilver = index === 1;
                            const isBronze = index === 2;

                            const share =
                                totalGross > 0
                                    ? Math.round((Number(category.gross || 0) / totalGross) * 100)
                                    : 0;

                            return (
                                <div
                                    key={category.id}
                                    className={`
                                        rounded-2xl border p-3.5 space-y-2 shadow-2xs transition
                                        ${
                                            isGold
                                                ? "border-amber-500/40 bg-amber-500/5"
                                                : isSilver
                                                ? "border-slate-400/40 bg-slate-400/5"
                                                : isBronze
                                                ? "border-amber-700/40 bg-amber-700/5"
                                                : "border-[var(--border)] bg-[var(--surface)]"
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span
                                                className={`
                                                    flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold
                                                    ${
                                                        isGold
                                                            ? "bg-amber-500 text-white shadow-2xs"
                                                            : isSilver
                                                            ? "bg-slate-400 text-white"
                                                            : isBronze
                                                            ? "bg-amber-700 text-white"
                                                            : "bg-[var(--surface-accent)] text-[var(--text-secondary)]"
                                                    }
                                                `}
                                            >
                                                {index + 1}
                                            </span>

                                            <h4 className="truncate text-sm font-bold text-[var(--text-primary)]">
                                                {capitalizeWords(category.name)}
                                            </h4>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="text-xs font-extrabold text-[var(--success)]">
                                                +{formatCurrency(category.earnings, { isPrivate })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Share Bar */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-semibold text-[var(--text-secondary)]">
                                            <span>Participación en ingresos</span>
                                            <span className="font-bold text-[var(--text-primary)]">{share}%</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-accent)]">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isGold
                                                        ? "bg-amber-500"
                                                        : isSilver
                                                        ? "bg-slate-400"
                                                        : isBronze
                                                        ? "bg-amber-700"
                                                        : "bg-[var(--primary)]"
                                                }`}
                                                style={{ width: `${Math.max(4, Math.min(100, share))}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Detailed Stats Row */}
                                    <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[11px]">
                                        <div className="rounded-xl bg-[var(--surface-accent)]/50 p-1.5">
                                            <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)]">Ventas</span>
                                            <p className="font-bold text-[var(--text-primary)]">{category.sales_count}</p>
                                        </div>

                                        <div className="rounded-xl bg-[var(--surface-accent)]/50 p-1.5">
                                            <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)]">Margen</span>
                                            <p className="font-bold text-[var(--primary)]">{category.margin_percentage || 0}%</p>
                                        </div>

                                        <div className="rounded-xl bg-[var(--surface-accent)]/50 p-1.5">
                                            <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)]">Ticket Prom.</span>
                                            <p className="font-bold text-[var(--text-primary)]">{formatCurrency(category.average_ticket || 0, { isPrivate })}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--border)] p-3.5 bg-[var(--surface)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-2xl bg-[var(--primary)] py-3 text-xs font-extrabold text-white shadow-md shadow-[var(--primary)]/20 active-press transition hover:bg-[var(--primary-hover)]"
                    >
                        Cerrar Ranking
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CategoryRankModal;
