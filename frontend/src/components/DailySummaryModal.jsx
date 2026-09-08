import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import {
    X,
    Share2,
    Copy,
    Trophy,
    Sparkles,
    TrendingUp,
    Clock,
    Flame,
    Crown,
    Package,
    BarChart3,
    ShoppingBag,
    ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCountUp } from "../hooks/useCountUp";
import { triggerConfetti, playFanfareSound } from "../utils/soundEffects";
import { isBambiEnabled, getCloseoutBambiMoment } from "../utils/bambiConfig";

function DailySummaryModal({
    isOpen,
    onClose,
    summary = { earnings: 0, gross: 0, investment: 0 },
    sales = [],
    periodLabel = "",
}) {
    const [viewMode, setViewMode] = useState("summary"); // "summary" | "analytics"
    const [bambiData, setBambiData] = useState(() => getCloseoutBambiMoment(summary, sales));

    useEffect(() => {
        if (isOpen) {
            triggerConfetti();
            playFanfareSound();
            setViewMode("summary");
            if (isBambiEnabled()) {
                setBambiData(getCloseoutBambiMoment(summary, sales));
            }
        }
    }, [isOpen, summary, sales]);

    const { displayValue: animatedEarnings, isBumping: isEarningsBumping } = useCountUp(
        summary?.earnings || 0,
        {
            startFromZero: true,
            duration: 1400,
            trigger: isOpen,
        }
    );
    const { displayValue: animatedGross } = useCountUp(summary?.gross || 0, {
        startFromZero: true,
        duration: 1200,
        trigger: isOpen,
    });
    const { displayValue: animatedInvestment } = useCountUp(summary?.investment || 0, {
        startFromZero: true,
        duration: 1000,
        trigger: isOpen,
    });

    if (!isOpen) return null;

    const safeSales = sales || [];
    const totalSalesCount = safeSales.length;
    const totalUnits = safeSales.reduce((sum, sale) => sum + (sale.quantity || 1), 0);

    // Calculate product breakdown for this period
    const productStats = {};
    safeSales.forEach((sale) => {
        const name = capitalizeWords(sale.product?.name || sale.description);
        if (!productStats[name]) {
            productStats[name] = { qty: 0, gross: 0, profit: 0 };
        }
        productStats[name].qty += sale.quantity || 1;
        productStats[name].gross += Number(sale.gross_amount || 0);
        productStats[name].profit +=
            Number(sale.gross_amount || 0) - Number(sale.investment_amount || 0);
    });

    const allProductsSorted = Object.entries(productStats).sort(
        (a, b) => b[1].gross - a[1].gross
    );
    const topProducts = Object.entries(productStats)
        .sort((a, b) => b[1].qty - a[1].qty)
        .slice(0, 5);

    // Practical Vendor Metrics
    const highestSale = safeSales.reduce(
        (max, s) => (Number(s.gross_amount || 0) > max ? Number(s.gross_amount || 0) : max),
        0
    );
    const topProductItem = allProductsSorted.length > 0 ? allProductsSorted[0] : null;
    const topProductShare =
        topProductItem && Number(summary.gross || 0) > 0
            ? Math.round((topProductItem[1].gross / Number(summary.gross || 0)) * 100)
            : 0;
    const uniqueProductsCount = allProductsSorted.length;

    // Hourly Distribution (Peak Hours)
    const hourlyStats = {};
    safeSales.forEach((sale) => {
        let hour = "12";
        if (sale.time) {
            hour = sale.time.slice(0, 2);
        } else if (sale.created_at) {
            hour = new Date(sale.created_at).getHours().toString().padStart(2, "0");
        }
        const label = `${hour}:00`;
        if (!hourlyStats[label]) {
            hourlyStats[label] = { gross: 0, count: 0, units: 0 };
        }
        hourlyStats[label].gross += Number(sale.gross_amount || 0);
        hourlyStats[label].count += 1;
        hourlyStats[label].units += sale.quantity || 1;
    });

    const sortedHours = Object.entries(hourlyStats).sort((a, b) =>
        a[0].localeCompare(b[0])
    );
    const maxHourGross = Math.max(...sortedHours.map(([_, d]) => d.gross), 1);
    const peakHour = sortedHours.reduce(
        (max, curr) => (curr[1].gross > (max ? max[1].gross : 0) ? curr : max),
        null
    );

    // Share Text Formatter (Short vs Full Detailed)
    const generateShareText = (isFull = false) => {
        let text = `🎉 *Resumen de Ventas - ${periodLabel}*\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `💰 *Ganancia Neta:* ${formatCurrency(summary.earnings)}\n`;
        text += `💵 *Total Recaudado:* ${formatCurrency(summary.gross)}\n`;
        text += `📦 *Costo/Inversión:* ${formatCurrency(summary.investment)}\n`;
        text += `🏷️ *Total Operaciones:* ${totalSalesCount} (${totalUnits} unidades)\n`;

        if (highestSale > 0) {
            text += `🔥 *Mayor Venta:* ${formatCurrency(highestSale)}\n`;
        }

        if (peakHour) {
            text += `⏰ *Hora Pico:* ${peakHour[0]} hs (${formatCurrency(peakHour[1].gross)})\n`;
        }

        const list = isFull ? allProductsSorted : topProducts;
        if (list.length > 0) {
            text += `\n🏆 *${isFull ? "Detalle Completo de Productos" : "Top Productos"}:*\n`;
            list.forEach(([name, data], idx) => {
                text += `${idx + 1}. ${name} (${data.qty} u) → ${formatCurrency(data.gross)}\n`;
            });
        }

        text += `━━━━━━━━━━━━━━━━━━━━━\n✨ *Market Manager*`;
        return text;
    };

    const handleCopy = async () => {
        const isFull = viewMode === "analytics";
        try {
            await navigator.clipboard.writeText(generateShareText(isFull));
            if (isBambiEnabled()) {
                toast.success(bambiData?.moment?.phrase || "Claro que si mamá!");
            } else {
                toast.success(
                    isFull
                        ? "¡Reporte detallado copiado al portapapeles! 📊"
                        : "¡Resumen copiado al portapapeles! 🎉"
                );
            }
        } catch (err) {
            toast.error("No se pudo copiar.");
        }
    };

    const handleWhatsApp = () => {
        const isFull = viewMode === "analytics";
        const text = encodeURIComponent(generateShareText(isFull));
        window.open(`https://wa.me/?text=${text}`, "_blank");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-2xl animate-pop-in">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20 animate-float">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
                                Cierre de Jornada
                            </h2>
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

                {/* View Mode Segmented Switcher */}
                <div className="flex p-1 bg-[var(--surface-accent)]/60 rounded-2xl border border-[var(--border)] my-3.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setViewMode("summary")}
                        className={`
                            flex-1 py-1.5 text-xs font-extrabold rounded-xl transition-all active-press flex items-center justify-center gap-1.5
                            ${
                                viewMode === "summary"
                                    ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }
                        `}
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[var(--warning)]" />
                        <span>Resumen</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("analytics")}
                        className={`
                            flex-1 py-1.5 text-xs font-extrabold rounded-xl transition-all active-press flex items-center justify-center gap-1.5
                            ${
                                viewMode === "analytics"
                                    ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }
                        `}
                    >
                        <BarChart3 className="w-3.5 h-3.5 text-[var(--primary)]" />
                        <span>Análisis Completo</span>
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="overflow-y-auto space-y-3.5 pr-0.5 no-scrollbar flex-1">
                    {/* Bambi Daily Performance Reaction (Exclusive to authorized accounts) */}
                    {isBambiEnabled() && bambiData?.moment && (
                        <div className="flex items-center justify-center gap-4 rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface-accent)]/50 via-[var(--surface)] to-[var(--surface-accent)]/50 px-4 py-3 shadow-xs text-center">
                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 flex items-center justify-center">
                                <img
                                    src={bambiData.moment.image}
                                    alt="Bambi"
                                    className="h-full w-full object-contain filter drop-shadow-sm pointer-events-none select-none"
                                />
                            </div>
                            <div className="min-w-0 text-left sm:text-center">
                                <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[var(--primary)]">
                                    {bambiData.isPositive ? "Veredicto de Bambi 🎉" : "Auditoría de Bambi 👀"}
                                </p>
                                <p className="text-sm sm:text-base md:text-lg font-black text-[var(--text-primary)] leading-snug">
                                    "{bambiData.moment.phrase}"
                                </p>
                            </div>
                        </div>
                    )}

                    {viewMode === "summary" ? (
                        <>
                            {/* Main Metrics Card with Fanfare */}
                            <div
                                className={`rounded-3xl border border-[var(--success-border)] bg-[var(--success-bg)] p-5 text-center shadow-inner relative overflow-hidden transition-all duration-300 ${
                                    isEarningsBumping
                                        ? "ring-2 ring-[var(--success)]/40 scale-[1.01]"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--success-text)]">
                                    <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                                    <span>Ganancia Neta del Período</span>
                                </div>
                                <p
                                    className={`mt-2 text-4xl font-black text-[var(--success-text)] tracking-tight transition-transform duration-200 ${
                                        isEarningsBumping ? "scale-105" : ""
                                    }`}
                                >
                                    +{formatCurrency(animatedEarnings)}
                                </p>
                                <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-[var(--success-border)]/50 pt-3 text-xs">
                                    <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)] p-2.5 shadow-xs">
                                        <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold tracking-wider">
                                            Ingresos
                                        </span>
                                        <span className="font-extrabold text-[var(--text-primary)] text-sm mt-0.5 block">
                                            {formatCurrency(animatedGross)}
                                        </span>
                                    </div>
                                    <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)] p-2.5 shadow-xs">
                                        <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold tracking-wider">
                                            Inversión
                                        </span>
                                        <span className="font-extrabold text-[var(--text-primary)] text-sm mt-0.5 block">
                                            {formatCurrency(animatedInvestment)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Operations & Units Badge */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)] p-3 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                        Operaciones
                                    </p>
                                    <p className="text-xl font-black text-[var(--text-primary)] mt-0.5">
                                        {totalSalesCount}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)] p-3 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                        Unidades Vendidas
                                    </p>
                                    <p className="text-xl font-black text-[var(--text-primary)] mt-0.5">
                                        {totalUnits}
                                    </p>
                                </div>
                            </div>

                            {/* Top Selling Products */}
                            {topProducts.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                            <Trophy className="w-3.5 h-3.5 text-[var(--warning)]" />
                                            <span>Top Productos del Período</span>
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode("analytics")}
                                            className="text-[11px] font-bold text-[var(--primary)] hover:underline flex items-center gap-0.5"
                                        >
                                            <span>Ver todos ({allProductsSorted.length})</span>
                                            <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                                        {topProducts.map(([name, data], idx) => (
                                            <div
                                                key={name}
                                                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-accent)]/40 px-3.5 py-2 text-xs"
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-extrabold text-white">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="font-bold text-[var(--text-primary)] truncate">
                                                        {name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="font-bold text-[var(--text-secondary)]">
                                                        {data.qty} u
                                                    </span>
                                                    <span className="font-bold text-[var(--text-primary)]">
                                                        {formatCurrency(data.gross)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Deep-Dive Analytics View (Clean & Focused on Practical Highlights) */
                        <div className="space-y-4 animate-slide-up">
                            {/* Practical Vendor Highlights */}
                            <div className="grid grid-cols-3 gap-2">
                                {/* Mayor Venta */}
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/40 p-2.5 flex flex-col items-center justify-between text-center min-h-[82px]">
                                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                        <Flame className="w-3 h-3 text-[var(--warning)] shrink-0" />
                                        <span className="truncate">Mayor Vta</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] my-0.5 truncate w-full">
                                        {highestSale > 0 ? formatCurrency(highestSale) : "-"}
                                    </p>
                                    <span className="text-[9px] font-semibold text-[var(--text-secondary)]">
                                        1 ticket
                                    </span>
                                </div>

                                {/* Producto Estrella */}
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/40 p-2.5 flex flex-col items-center justify-between text-center min-h-[82px]">
                                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                        <Crown className="w-3 h-3 text-[var(--warning)] shrink-0" />
                                        <span className="truncate">Estrella</span>
                                    </div>
                                    <p
                                        className="text-xs sm:text-sm font-extrabold text-[var(--primary)] my-0.5 truncate w-full"
                                        title={topProductItem ? topProductItem[0] : ""}
                                    >
                                        {topProductItem ? topProductItem[0] : "-"}
                                    </p>
                                    <span className="text-[9px] font-semibold text-[var(--text-secondary)]">
                                        {topProductShare > 0 ? `${topProductShare}% total` : "top ventas"}
                                    </span>
                                </div>

                                {/* Productos Vendidos */}
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/40 p-2.5 flex flex-col items-center justify-between text-center min-h-[82px]">
                                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                        <Package className="w-3 h-3 text-[var(--primary)] shrink-0" />
                                        <span className="truncate">Variedad</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] my-0.5 truncate w-full">
                                        {uniqueProductsCount}
                                    </p>
                                    <span className="text-[9px] font-semibold text-[var(--text-secondary)]">
                                        productos
                                    </span>
                                </div>
                            </div>

                            {/* Hourly Peak Hours Breakdown (CSS Bar Chart) */}
                            {sortedHours.length > 0 && (
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                                            <span>Ventas por Hora</span>
                                        </h4>
                                        {peakHour && (
                                            <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">
                                                🔥 Pico: {peakHour[0]} hs
                                            </span>
                                        )}
                                    </div>

                                    {/* Pure CSS Bar Visualizer with Animated Grow */}
                                    <div className="flex items-end gap-2 h-28 pt-4 pb-1 px-1 overflow-x-auto no-scrollbar border-b border-[var(--border)]/60">
                                        {sortedHours.map(([hour, data]) => {
                                            const heightPercent = Math.max(
                                                (data.gross / maxHourGross) * 100,
                                                12
                                            );
                                            const isPeak = peakHour && peakHour[0] === hour;

                                            return (
                                                <div
                                                    key={hour}
                                                    className="flex-1 min-w-[36px] flex flex-col items-center gap-1 h-full justify-end group"
                                                >
                                                    <span className="text-[9px] font-bold text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition truncate">
                                                        {formatCurrency(data.gross)}
                                                    </span>
                                                    <div
                                                        style={{ height: `${heightPercent}%` }}
                                                        className={`w-full rounded-t-lg animate-grow-bar transition-all duration-300 ${
                                                            isPeak
                                                                ? "bg-[var(--primary)] shadow-sm"
                                                                : "bg-[var(--secondary)]/60 hover:bg-[var(--primary)]/80"
                                                        }`}
                                                    />
                                                    <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                                                        {hour.slice(0, 2)}h
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}


                            {/* All Products List */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <ShoppingBag className="w-3.5 h-3.5 text-[var(--warning)]" />
                                    <span>Todos los Productos ({allProductsSorted.length})</span>
                                </h4>

                                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                                    {allProductsSorted.map(([name, data], idx) => (
                                        <div
                                            key={name}
                                            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-accent)]/30 px-3 py-2 text-xs"
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--surface-accent)] text-[10px] font-bold text-[var(--text-secondary)]">
                                                    {idx + 1}
                                                </span>
                                                <span className="font-bold text-[var(--text-primary)] truncate">
                                                    {name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2.5 shrink-0">
                                                <span className="font-semibold text-[var(--text-secondary)] text-[11px]">
                                                    {data.qty} u
                                                </span>
                                                <span className="font-extrabold text-[var(--text-primary)]">
                                                    {formatCurrency(data.gross)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)] shrink-0">
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
                            font-bold
                            text-[var(--text-primary)]
                            transition
                            active-press
                            hover:bg-[var(--surface)]
                        "
                    >
                        <Copy className="w-4 h-4" />
                        <span>{viewMode === "analytics" ? "Copiar Detalle" : "Copiar Resumen"}</span>
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
                        <span>{viewMode === "analytics" ? "WhatsApp Detalle" : "WhatsApp Resumen"}</span>
                    </button>
                </div>

            </div>
        </div>
    );
}

export default DailySummaryModal;
