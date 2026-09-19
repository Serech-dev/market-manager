import { formatCurrency } from "../utils/formatCurrency";
import { TrendingUp, Wallet, Coins, Eye, EyeOff } from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import { usePrivacy } from "../context/PrivacyContext";

function SummaryCard({ title, value, variant, cacheKey, isLoading }) {
    const { isPrivate, togglePrivacy } = usePrivacy();
    const isProfit = variant === "profit";
    const isInvestment = title.toLowerCase().includes("inversi");
    const { displayValue, isBumping } = useCountUp(value, {
        duration: 750,
        cacheKey,
        isLoading,
    });

    const Icon = isProfit ? TrendingUp : isInvestment ? Coins : Wallet;

    return (
        <div
            className={`
                relative
                overflow-hidden
                rounded-2xl
                border
                p-4
                transition-all
                duration-300
                shadow-sm
                ${
                    isProfit
                        ? "border-[var(--success-border)] bg-[var(--success-bg)] text-center w-full"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/30"
                }
                ${isBumping ? "ring-2 ring-[var(--primary)]/30 scale-[1.02]" : ""}
            `}
        >
            <div className={`flex items-center gap-2 ${isProfit ? "justify-center" : "justify-between"}`}>
                <div className="flex items-center gap-1.5">
                    <span
                        className={`
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            ${
                                isProfit
                                    ? "text-[var(--success-text)] font-bold"
                                    : "text-[var(--text-secondary)]"
                            }
                        `}
                    >
                        {title}
                    </span>

                    {isProfit && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePrivacy();
                            }}
                            title={isPrivate ? "Mostrar montos" : "Ocultar montos"}
                            aria-label={isPrivate ? "Mostrar montos" : "Ocultar montos"}
                            className="
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-md
                                text-[var(--success-text)]/70
                                transition
                                active-press
                                hover:text-[var(--success-text)]
                                hover:bg-[var(--success)]/15
                            "
                        >
                            {isPrivate ? (
                                <EyeOff className="w-3.5 h-3.5 text-[var(--success-text)]" />
                            ) : (
                                <Eye className="w-3.5 h-3.5" />
                            )}
                        </button>
                    )}
                </div>

                {!isProfit && (
                    <div
                        className={`
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            transition-transform
                            duration-300
                            ${isBumping ? "scale-125 rotate-6" : ""}
                            bg-[var(--surface-accent)] text-[var(--text-secondary)]
                        `}
                    >
                        <Icon className="w-4 h-4" />
                    </div>
                )}
            </div>

            <p
                className={`
                    mt-1.5
                    font-extrabold
                    tracking-tight
                    transition-transform
                    duration-200
                    ${isBumping ? "scale-105" : ""}
                    ${
                        isProfit
                            ? "text-3xl sm:text-4xl text-[var(--success)]"
                            : "text-xl sm:text-2xl text-[var(--text-primary)]"
                    }
                    ${isPrivate ? "tracking-widest" : ""}
                `}
            >
                {formatCurrency(displayValue, { isPrivate })}
            </p>
        </div>
    );
}

export default SummaryCard;

