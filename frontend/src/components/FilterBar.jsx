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
    const buttonClass = (mode) =>
        `flex-1 rounded-lg py-3 font-semibold transition ${
            filterMode === mode
                ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-hover)]"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-accent)]"
        }`;

    return (
        <div>
            <div className="flex gap-2">
                <button
                    type="button" 
                    className={buttonClass("day")}
                    onClick={() => setFilterMode("day")}
                >
                    Día
                </button>

                <button
                    type="button"
                    className={buttonClass("month")}
                    onClick={() => setFilterMode("month")}
                >
                    Mes
                </button>

                <button
                    type="button"
                    className={buttonClass("period")}
                    onClick={() => setFilterMode("period")}
                >
                    Período
                </button>
            </div>

            {filterMode === "day" && (
                <input
                    className="
                        mt-3
                        w-full
                        rounded-lg
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-3
                        text-[var(--text-primary)]
                        outline-none
                        transition
                        focus:border-[var(--primary)]
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                    "
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                        setSelectedDate(e.target.value)
                    }
                />
            )}

            {filterMode === "month" && (
                <input
                    className="
                        mt-3
                        w-full
                        rounded-lg
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-3
                        text-[var(--text-primary)]
                        outline-none
                        transition
                        focus:border-[var(--primary)]
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                    "
                    type="month"
                    value={selectedMonth}
                    onChange={(e) =>
                        setSelectedMonth(e.target.value)
                    }
                />
            )}

            {invalidPeriod && (
                <p className="mt-2 text-sm text-[var(--danger-text)]">
                    La fecha de inicio no puede ser posterior a la fecha de fin.
                </p>
            )}

            {filterMode === "period" && (
                <div className="mt-3">
                    <p className="mb-2 text-sm text-[var(--text-secondary)]">
                        Selecciona el período que quieres consultar
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                                Desde
                            </label>

                            <input
                                className="
                                    mt-3
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-3
                                    text-[var(--text-primary)]
                                    outline-none
                                    transition
                                    focus:border-[var(--primary)]
                                    focus:ring-2
                                    focus:ring-[var(--primary)]/20
                                "
                                type="date"
                                value={selectedDateFrom}
                                onChange={(e) =>
                                    setSelectedDateFrom(e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                                Hasta
                            </label>

                            <input
                                className="
                                    mt-3
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-3
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
                </div>
            )}
        </div>
    );
}

export default FilterBar;