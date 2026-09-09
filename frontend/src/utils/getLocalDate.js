export default function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Returns the YYYY-MM-DD string for Monday (start of week) corresponding to the given date or today
 */
export function getStartOfWeek(dateStr) {
    const baseDateStr = dateStr || getLocalDate();
    const [y, m, d] = baseDateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diff = (day === 0 ? -6 : 1) - day; // Distance to Monday
    date.setDate(date.getDate() + diff);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayNum = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${dayNum}`;
}