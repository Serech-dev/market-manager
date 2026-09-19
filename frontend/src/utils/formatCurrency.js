export const PRIVACY_MASK = "$ ••••••";

export function formatCurrency(value, options = {}) {
    if (options.isPrivate) {
        return PRIVACY_MASK;
    }
    const num = Number(value) || 0;
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(num);
}