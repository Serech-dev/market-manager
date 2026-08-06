function FilterBar({
    filterMode,
    setFilterMode,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
}) {
    return (
        <div>
            <div className="flex gap-2">
                <button
                    className={`flex-1 rounded-lg py-3 font-semibold transition ${
                        filterMode === "day"
                            ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-hover)]"
                            : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-accent)]"
                    }`}
                    onClick={() => setFilterMode("day")}
                >
                    Día
                </button>

                <button
                    className={`flex-1 rounded-lg py-3 font-semibold transition ${
                        filterMode === "month"
                            ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-hover)]"
                            : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-accent)]"
                    }`}
                    onClick={() => setFilterMode("month")}
                >
                    Mes
                </button>
            </div>

            {filterMode === "day" ? (
                <input
                    className="mt-3 w-full rounded-lg border p-3"
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                        setSelectedDate(e.target.value)
                    }
                />
            ) : (
                <input
                    className="mt-3 w-full rounded-lg border p-3"
                    type="month"
                    value={selectedMonth}
                    onChange={(e) =>
                        setSelectedMonth(e.target.value)
                    }
                />
            )}
        </div>
    );
}

export default FilterBar;