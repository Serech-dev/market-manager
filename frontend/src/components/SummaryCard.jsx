import { formatCurrency } from "../utils/formatCurrency";


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
                        ? "border-[var(--success-border)] bg-[var(--success-bg)]"
                        : "border-[var(--border)] bg-[var(--surface-accent)]"
                }
                ${isProfit ? "max-w-sm text-center" : ""}
            `}
        >
            <p
                className={`
                    text-sm
                    ${
                        isProfit
                            ? "font-bold text-[var(--success-text)]"
                            : "text-[var(--text-secondary)]"
                    }
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
                            ? "text-4xl text-[var(--success)]"
                            : "text-2xl text-[var(--text-primary)]"
                    }
                `}
            >
                {formatCurrency(value)}
            </p>
        </div>
    );
}

export default SummaryCard;