function SummaryCard({ title, value, variant }) {
    const isProfit = variant === "profit";

    return (
        <div
            className={`
                rounded-2xl
                border
                p-5
                shadow-sm
                ${
                    isProfit
                        ? "border-green-200 bg-green-200"
                        : "border-stone-200 bg-[var(--background)]"
                }
                ${isProfit ? "max-w-sm text-center" : ""}
            `}
        >
            <p
                className={`
                    text-sm
                    text-[var(--text-secondary)]
                    ${isProfit ? "font-bold text-[var(--text-primary)]" : ""}
                `}
            >
                {title}
            </p>

            <p
                className={`
                    mt-2
                    font-bold
                    ${
                        isProfit
                            ? "text-4xl text-green-700"
                            : "text-2xl text-[var(--text-primary)]"
                    }
                `}
            >
                ${value}
            </p>
        </div>
    );
}

export default SummaryCard;