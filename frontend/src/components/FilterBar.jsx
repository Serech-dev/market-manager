import { Calendar, CalendarDays, CalendarRange, Sparkles } from "lucide-react";
import getLocalDate from "../utils/getLocalDate";

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
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const currentMonth = today.slice(0, 7);

    const isToday = filterMode === "day" && selectedDate === today;
    const isYesterday = filterMode === "day" && selectedDate === yesterday;
    const isThisMonth = filterMode === "month" && selectedMonth === currentMonth;

    const setQuickDay = (day) => {
        setFilterMode("day");
        setSelectedDate(day);
    };

    const setQuickMonth = (month) => {
        setFilterMode("month");
        setSelectedMonth(month);
    };

    const segmentBtnClass = (active) =>
        `flex items-center justify-center gap-1.5 flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition active-press ${
            active
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-accent)] border border-[var(--border)]"
        }`;

    const quickChipClass = (active) =>
        `px-3 py-1.5 rounded-lg text-xs font-medium transition active-press border ${
            active
                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm font-semibold"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)]"
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

            {/* Quick Shortcuts & Inputs based on Mode */}
            {filterMode === "day" && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setQuickDay(today)}
                            className={quickChipClass(isToday)}
                        >
                            Hoy
                        </button>
                        <button
                            type="button"
                            onClick={() => setQuickDay(yesterday)}
                            className={quickChipClass(isYesterday)}
                        >
                            Ayer
                        </button>
                        <span className="text-xs text-[var(--text-secondary)] ml-auto">
                            O elige fecha:
                        </span>
                    </div>

                    <div className="relative">
                        <input
                            className="
                                w-full
                                rounded-xl
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]
                                p-2.5
                                text-sm
                                font-medium
                                text-[var(--text-primary)]
                                outline-none
                                transition
                                focus:border-[var(--primary)]
                                focus:ring-2
                                focus:ring-[var(--primary)]/20
                            "
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {filterMode === "month" && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setQuickMonth(currentMonth)}
                            className={quickChipClass(isThisMonth)}
                        >
                            Este Mes
                        </button>
                        <span className="text-xs text-[var(--text-secondary)] ml-auto">
                            O elige mes:
                        </span>
                    </div>

                    <input
                        className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            p-2.5
                            text-sm
                            font-medium
                            text-[var(--text-primary)]
                            outline-none
                            transition
                            focus:border-[var(--primary)]
                            focus:ring-2
                            focus:ring-[var(--primary)]/20
                        "
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                </div>
            )}

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