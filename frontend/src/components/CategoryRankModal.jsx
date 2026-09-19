import { useEffect } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import {
    X,
    Trophy,
    Sparkles,
    TrendingUp,
    Crown,
    Tags,
    Share2,
    Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCountUp } from "../hooks/useCountUp";
import { triggerConfetti, playFanfareSound } from "../utils/soundEffects";
import { usePrivacy } from "../context/PrivacyContext";

function CategoryRankModal({
    isOpen,
    onClose,
    categories = [],
    periodLabel = "",
}) {
    const { isPrivate } = usePrivacy();

    useEffect(() => {
        if (isOpen) {
            triggerConfetti();
            playFanfareSound();
        }
    }, [isOpen]);

    const safeCategories = (categories || [])
        .filter((c) => Number(c.gross || 0) > 0 || Number(c.sales_count || 0) > 0)
        .sort((a, b) => Number(b.earnings || 0) - Number(a.earnings || 0));

    const totalGross = safeCategories.reduce((sum, c) => sum + Number(c.gross || 0), 0);
    const totalEarnings = safeCategories.reduce((sum, c) => sum + Number(c.earnings || 0), 0);
    const totalSales = safeCategories.reduce((sum, c) => sum + Number(c.sales_count || 0), 0);

    const { displayValue: animatedEarnings, isBumping } = useCountUp(totalEarnings, {
        startFromZero: true,
        duration: 1200,
        trigger: isOpen,
    });

    if (!isOpen) return null;

    const first = safeCategories[0] || null;
    const second = safeCategories[1] || null;
    const third = safeCategories[2] || null;

    const firstShare =
        first && totalGross > 0
            ? Math.round((Number(first.gross || 0) / totalGross) * 100)
            : 0;

    function generateShareText() {
        const lines = [
            `🏆 *Ranking de Categorías - Market Manager*`,
            periodLabel ? `📅 Período: ${periodLabel}` : "",
            `💰 Ganancia Total: ${formatCurrency(totalEarnings, { isPrivate })}`,
            `💵 Ingresos Totales: ${formatCurrency(totalGross, { isPrivate })}`,
            `📦 Ventas Totales: ${totalSales}`,
            "",
            "🥇 *Podio de Categorías:*",
            ...safeCategories.map((c, i) => {
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
                return `${medal} *${capitalizeWords(c.name)}*: +${formatCurrency(c.earnings, { isPrivate })} (${c.sales_count} ventas · ${c.margin_percentage || 0}% margen)`;
            }),
            "",
            "✨ *Market Manager*",
        ].filter(Boolean);

        return lines.join("\n");
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(generateShareText());
            toast.success("¡Ranking copiado al portapapeles! 🏆");
        } catch {
            toast.error("No se pudo copiar.");
        }
    }

    function handleWhatsApp() {
        const text = encodeURIComponent(generateShareText());
        window.open(`https://wa.me/?text=${text}`, "_blank");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
            <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-pop-in">
                
                {/* Header */}
                <div className="relative border-b border-[var(--border)] bg-[var(--surface-accent)]/40 p-4 sm:p-5 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--warning)] text-white shadow-md shadow-[var(--warning)]/20 animate-float">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
                                    Ranking de Categorías
                                </h2>
                                <p className="text-xs font-medium text-[var(--text-secondary)] capitalize">
                                    {periodLabel || "Resumen del período"}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)] active-press transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">

                    {safeCategories.length === 0 ? (
                        <div className="p-8 text-center space-y-2.5">
                            <Tags className="mx-auto w-10 h-10 text-[var(--text-secondary)] opacity-50" />
                            <p className="text-sm font-bold text-[var(--text-primary)]">
                                Sin ventas categorizadas
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                                No se registraron ventas con categorías asignadas en este período.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Total Profit Highlight Card */}
                            <div
                                className={`rounded-3xl border border-[var(--success-border)] bg-[var(--success-bg)] p-4 text-center shadow-inner relative overflow-hidden transition-all duration-300 ${
                                    isBumping ? "ring-2 ring-[var(--success)]/40 scale-[1.01]" : ""
                                }`}
                            >
                                <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--success-text)]">
                                    <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                                    <span>Ganancia de Categorías</span>
                                </div>
                                <p
                                    className={`mt-1 text-3xl sm:text-4xl font-black text-[var(--success-text)] tracking-tight transition-transform duration-200 ${
                                        isBumping ? "scale-105" : ""
                                    } ${isPrivate ? "tracking-widest" : ""}`}
                                >
                                    +{formatCurrency(animatedEarnings, { isPrivate })}
                                </p>
                                <div className="mt-3 flex items-center justify-center gap-4 text-xs font-semibold text-[var(--text-secondary)] border-t border-[var(--success-border)]/50 pt-2.5">
                                    <span>
                                        📦 <strong className="text-[var(--text-primary)]">{totalSales}</strong> ventas
                                    </span>
                                    <span>·</span>
                                    <span>
                                        💵 <strong className="text-[var(--text-primary)]">{formatCurrency(totalGross, { isPrivate })}</strong> ingresos
                                    </span>
                                </div>
                            </div>

                            {/* Visual Podium (Top 3 or Champion Card) */}
                            {safeCategories.length >= 2 ? (
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/30 p-3 pt-5">
                                    <div className="flex items-end justify-center gap-2">
                                        {/* 2nd Place */}
                                        {second && (
                                            <div className="flex-1 flex flex-col items-center">
                                                <div className="mb-2 text-center w-full px-1">
                                                    <span className="text-2xl drop-shadow-sm">🥈</span>
                                                    <p className="text-xs font-bold text-[var(--text-primary)] truncate mt-1" title={second.name}>
                                                        {capitalizeWords(second.name)}
                                                    </p>
                                                    <p className="text-xs font-extrabold text-[var(--success)] truncate mt-0.5">
                                                        +{formatCurrency(second.earnings, { isPrivate })}
                                                    </p>
                                                    <span className="inline-block text-[10px] font-semibold text-[var(--text-secondary)]">
                                                        {second.margin_percentage || 0}% mg
                                                    </span>
                                                </div>
                                                <div className="w-full h-20 rounded-t-2xl bg-gradient-to-b from-slate-400/25 to-slate-400/10 border-t-2 border-x-2 border-slate-400/40 flex items-center justify-center">
                                                    <span className="text-2xl font-black text-slate-400">2</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* 1st Place */}
                                        {first && (
                                            <div className="flex-1 flex flex-col items-center -mt-2">
                                                <div className="mb-2 text-center w-full px-1">
                                                    <div className="inline-flex items-center justify-center text-amber-500 animate-bounce">
                                                        <Crown className="w-6 h-6 fill-amber-400 text-amber-500" />
                                                    </div>
                                                    <p className="text-sm font-black text-[var(--text-primary)] truncate mt-0.5" title={first.name}>
                                                        {capitalizeWords(first.name)}
                                                    </p>
                                                    <p className="text-xs font-black text-[var(--success)] truncate mt-0.5">
                                                        +{formatCurrency(first.earnings, { isPrivate })}
                                                    </p>
                                                    <span className="inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                                                        {firstShare}% ingresos
                                                    </span>
                                                </div>
                                                <div className="w-full h-28 rounded-t-2xl bg-gradient-to-b from-amber-400/30 to-amber-500/10 border-t-2 border-x-2 border-amber-500/50 flex flex-col items-center justify-center shadow-lg shadow-amber-500/10">
                                                    <span className="text-3xl font-black text-amber-500">1</span>
                                                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                                        Líder
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3rd Place */}
                                        {third ? (
                                            <div className="flex-1 flex flex-col items-center">
                                                <div className="mb-2 text-center w-full px-1">
                                                    <span className="text-2xl drop-shadow-sm">🥉</span>
                                                    <p className="text-xs font-bold text-[var(--text-primary)] truncate mt-1" title={third.name}>
                                                        {capitalizeWords(third.name)}
                                                    </p>
                                                    <p className="text-xs font-extrabold text-[var(--success)] truncate mt-0.5">
                                                        +{formatCurrency(third.earnings, { isPrivate })}
                                                    </p>
                                                    <span className="inline-block text-[10px] font-semibold text-[var(--text-secondary)]">
                                                        {third.margin_percentage || 0}% mg
                                                    </span>
                                                </div>
                                                <div className="w-full h-14 rounded-t-2xl bg-gradient-to-b from-amber-700/20 to-amber-800/5 border-t-2 border-x-2 border-amber-700/40 flex items-center justify-center">
                                                    <span className="text-xl font-black text-amber-700/80">3</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1" />
                                        )}
                                    </div>
                                </div>
                            ) : first ? (
                                <div className="flex items-center justify-between rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                                            <Crown className="w-6 h-6 fill-amber-400" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">
                                                Categoría Líder
                                            </span>
                                            <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                                                {capitalizeWords(first.name)}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-black text-[var(--success)]">
                                            +{formatCurrency(first.earnings, { isPrivate })}
                                        </span>
                                        <p className="text-[11px] font-bold text-[var(--text-secondary)]">
                                            {first.margin_percentage || 0}% margen
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            {/* Complete Leaderboard Breakdown */}
                            <div className="space-y-2 pt-1">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 px-0.5">
                                    <Sparkles className="w-3.5 h-3.5 text-[var(--warning)]" />
                                    <span>Tabla de Rendimiento ({safeCategories.length})</span>
                                </h3>

                                <div className="space-y-2">
                                    {safeCategories.map((category, index) => {
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
                                                    rounded-2xl border p-3.5 space-y-2.5 transition shadow-2xs
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
                                                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                                        </span>

                                                        <h4 className="truncate text-sm font-bold text-[var(--text-primary)]">
                                                            {capitalizeWords(category.name)}
                                                        </h4>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <span className="text-xs font-black text-[var(--success)]">
                                                            +{formatCurrency(category.earnings, { isPrivate })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Relative Contribution Bar */}
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-semibold text-[var(--text-secondary)]">
                                                        <span>Participación en ventas</span>
                                                        <span className="font-bold text-[var(--text-primary)]">{share}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-accent)]">
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

                                                {/* Metric Pills */}
                                                <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-center text-xs">
                                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-1.5">
                                                        <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)]">Ventas</span>
                                                        <p className="font-extrabold text-[var(--text-primary)] text-[11px]">{category.sales_count}</p>
                                                    </div>

                                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-1.5">
                                                        <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)]">Margen</span>
                                                        <p className="font-extrabold text-[var(--primary)] text-[11px]">{category.margin_percentage || 0}%</p>
                                                    </div>

                                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-1.5">
                                                        <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)]">Ingresos</span>
                                                        <p className="font-extrabold text-[var(--text-primary)] text-[11px]">{formatCurrency(category.gross || 0, { isPrivate })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Action Buttons */}
                <div className="grid grid-cols-2 gap-3 p-4 border-t border-[var(--border)] bg-[var(--surface)] shrink-0">
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
                            py-3
                            text-xs
                            font-extrabold
                            text-[var(--text-primary)]
                            transition
                            active-press
                            hover:bg-[var(--surface)]
                        "
                    >
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
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
                            py-3
                            text-xs
                            font-extrabold
                            text-white
                            shadow-md
                            shadow-[#25D366]/20
                            transition
                            active-press
                            hover:bg-[#1EBE5D]
                        "
                    >
                        <Share2 className="w-4 h-4" />
                        <span>WhatsApp</span>
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CategoryRankModal;
