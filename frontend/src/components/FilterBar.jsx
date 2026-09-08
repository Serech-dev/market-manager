import { Calendar, CalendarDays, CalendarRange, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import getLocalDate from "../utils/getLocalDate";

/**
 * Local timezone date arithmetic helper
 */
function shiftDate(dateStr, days) {
    if (!dateStr) return getLocalDate();
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Local timezone month arithmetic helper
 */
function shiftMonth(monthStr, months) {
    if (!monthStr) return getLocalDate().slice(0, 7);
    const [y, m] = monthStr.split("-").map(Number);
    const date = new Date(y, m - 1 + months, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

/**
 * Friendly localized day descriptor
 */
function getDayInfo(dateStr, todayStr) {
    if (!dateStr) return { tag: "", label: "" };
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const yesterdayStr = shiftDate(todayStr, -1);

    let tag = "";
    if (dateStr === todayStr) tag = "Hoy";
    else if (dateStr === yesterdayStr) tag = "Ayer";

    const weekday = date.toLocaleDateString("es-AR", { weekday: "short" });
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace(".", "");
    const dateFormatted = date.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });

    return {
        tag,
        label: `${capitalizedWeekday}, ${dateFormatted}`,
    };
}

/**
 * Friendly localized month descriptor
 */
function getMonthInfo(monthStr, currentMonthStr) {
    if (!monthStr) return { tag: "", label: "" };
    const [y, m] = monthStr.split("-").map(Number);
    const date = new Date(y, m - 1, 1);
    const isCurrent = monthStr === currentMonthStr;

    const monthFormatted = date.toLocaleDateString("es-AR", {
        month: "long",
        year: "numeric",
    });
    const capitalized = monthFormatted.charAt(0).toUpperCase() + monthFormatted.slice(1);

    return {
        tag: isCurrent ? "Este Mes" : "",
        label: capitalized,
    };
}

function FilterBar({
    filterMode,
    setFilterMode,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    selectedDateFrom,
    setSelectedDateFrom,
    selectedDateTo,
    setSelectedDateTo,
    invalidPeriod,
}) {
    const today = getLocalDate();
    const currentMonth = today.slice(0, 7);

    const isToday = filterMode === "day" && selectedDate === today;
    const isThisMonth = filterMode === "month" && selectedMonth === currentMonth;

    const dayInfo = getDayInfo(selectedDate, today);
    const monthInfo = getMonthInfo(selectedMonth, currentMonth);

    const segmentBtnClass = (active) =>
        `flex items-center justify-center gap-1.5 flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition active-press ${
            active
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-accent)] border border-[var(--border)]"
        }`;

    return (
        <div className="space-y-3">
            {/* Mode Selector Tabs */}
            <div className="flex gap-2">
                <button
                    type="button"
                    className={segmentBtnClass(filterMode === "day")}
                    onClick={() => setFilterMode("day")}
                >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Día</span>
                </button>

                <button
                    type="button"
                    className={segmentBtnClass(filterMode === "month")}
                    onClick={() => setFilterMode("month")}
                >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Mes</span>
                </button>

                <button
                    type="button"
                    className={segmentBtnClass(filterMode === "period")}
                    onClick={() => setFilterMode("period")}
                >
                    <CalendarRange className="w-3.5 h-3.5" />
                    <span>Rango</span>
                </button>
            </div>

            {/* Día Mode: Prev / Next Stepper with Clickable Calendar */}
            {filterMode === "day" && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/30 p-1.5 shadow-xs">
                        <button
                            type="button"
                            onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
                            title="Día anterior"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs transition hover:bg-[var(--surface-accent)] active-press shrink-0"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <label className="relative flex-1 flex flex-col items-center justify-center py-1 px-2 cursor-pointer rounded-xl hover:bg-[var(--surface)]/60 transition group">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="flex items-center gap-1.5">
                                {dayInfo.tag && (
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--primary)] text-white shadow-xs">
                                        {dayInfo.tag}
                                    </span>
                                )}
                                <span className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                    {dayInfo.label}
                                </span>
                            </div>
                        </label>

                        <button
                            type="button"
                            onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}
                            title="Día siguiente"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs transition hover:bg-[var(--surface-accent)] active-press shrink-0"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick Shortcut to Today */}
                    {!isToday && (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setSelectedDate(today)}
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition active-press"
                            >
                                <RotateCcw className="w-3 h-3" />
                                <span>Volver a Hoy</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Mes Mode: Prev / Next Stepper */}
            {filterMode === "month" && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-accent)]/30 p-1.5 shadow-xs">
                        <button
                            type="button"
                            onClick={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}
                            title="Mes anterior"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs transition hover:bg-[var(--surface-accent)] active-press shrink-0"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <label className="relative flex-1 flex flex-col items-center justify-center py-1 px-2 cursor-pointer rounded-xl hover:bg-[var(--surface)]/60 transition group">
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="flex items-center gap-1.5">
                                {monthInfo.tag && (
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--primary)] text-white shadow-xs">
                                        {monthInfo.tag}
                                    </span>
                                )}
                                <span className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                    {monthInfo.label}
                                </span>
                            </div>
                        </label>

                        <button
                            type="button"
                            onClick={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}
                            title="Mes siguiente"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs transition hover:bg-[var(--surface-accent)] active-press shrink-0"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick Shortcut to Current Month */}
                    {!isThisMonth && (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setSelectedMonth(currentMonth)}
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition active-press"
                            >
                                <RotateCcw className="w-3 h-3" />
                                <span>Volver a Este Mes</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Rango Mode */}
            {filterMode === "period" && (
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                                Desde
                            </label>
                            <input
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-2
                                    text-xs
                                    font-medium
                                    text-[var(--text-primary)]
                                    outline-none
                                    transition
                                    focus:border-[var(--primary)]
                                    focus:ring-2
                                    focus:ring-[var(--primary)]/20
                                "
                                type="date"
                                value={selectedDateFrom}
                                onChange={(e) => setSelectedDateFrom(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                                Hasta
                            </label>
                            <input
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-2
                                    text-xs
                                    font-medium
                                    text-[var(--text-primary)]
                                    outline-none
                                    transition
                                    focus:border-[var(--primary)]
                                    focus:ring-2
                                    focus:ring-[var(--primary)]/20
                                "
                                type="date"
                                value={selectedDateTo}
                                onChange={(e) => setSelectedDateTo(e.target.value)}
                            />
                        </div>
                    </div>

                    {invalidPeriod && (
                        <p className="text-xs font-medium text-[var(--danger)]">
                            ⚠️ La fecha inicial debe ser anterior o igual a la final.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default FilterBar;