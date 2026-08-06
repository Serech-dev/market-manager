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
                    className={`flex-1 rounded-lg p-3 ${
                        filterMode === "day"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                    }`}
                    onClick={() => setFilterMode("day")}
                >
                    Día
                </button>

                <button
                    className={`flex-1 rounded-lg p-3 ${
                        filterMode === "month"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
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