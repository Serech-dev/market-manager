import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";
import { Clock, Edit2, Trash2 } from "lucide-react";

function SaleCard({ sale, onDelete, showActions = true }) {
    const navigate = useNavigate();
    const profit = Number(sale.gross_amount) - Number(sale.investment_amount);

    return (
        <div
            className="
                group
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-4
                shadow-sm
                transition-all
                hover:border-[var(--primary)]/40
                hover:shadow-md
            "
        >
            {/* Top row: Title, Quantity & Profit Pill */}
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center justify-center rounded-lg bg-[var(--surface-accent)] px-2 py-0.5 text-xs font-bold text-[var(--text-primary)]">
                            {sale.quantity}x
                        </span>
                        <h3 className="truncate text-base font-bold text-[var(--text-primary)]">
                            {capitalizeWords(sale.product?.name || sale.description)}
                        </h3>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
                        <span>
                            {sale.date}
                            {sale.time ? ` · ${sale.time.slice(0, 5)} hs` : ""}
                        </span>
                    </div>
                </div>

                {/* Profit Pill */}
                <div className="text-right shrink-0">
                    <div className="inline-flex items-center rounded-full bg-[var(--success-bg)] px-2.5 py-1 text-xs font-bold text-[var(--success)] border border-[var(--success-border)]">
                        +{formatCurrency(profit)}
                    </div>
                </div>
            </div>

            {/* Middle row: Breakdown details */}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-2.5 text-xs text-[var(--text-secondary)]">
                <div>
                    <span>Total venta: </span>
                    <span className="font-bold text-[var(--text-primary)]">
                        {formatCurrency(sale.gross_amount)}
                    </span>
                </div>

                <div>
                    <span>Costo: </span>
                    <span className="font-medium text-[var(--text-secondary)]">
                        {formatCurrency(sale.investment_amount)}
                    </span>
                </div>

                {/* Action buttons (Clean, compact icons with touch targets) */}
                {showActions && (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            aria-label="Editar venta"
                            onClick={() => navigate(`/sales/${sale.id}/edit`)}
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-[var(--text-secondary)]
                                transition
                                active-press
                                hover:bg-[var(--surface-accent)]
                                hover:text-[var(--primary)]
                            "
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                            type="button"
                            aria-label="Eliminar venta"
                            onClick={() => onDelete(sale.id)}
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-[var(--text-secondary)]
                                transition
                                active-press
                                hover:bg-[var(--danger-bg)]
                                hover:text-[var(--danger)]
                            "
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SaleCard;