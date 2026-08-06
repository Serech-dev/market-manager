function SummaryCard({ title, value }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-[var(--background)] p-5 shadow-sm">

            <p className="text-sm text-[var(--text-primary)]">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold [var(--secondary)]">
                ${value}
            </p>

        </div>
    );
}

export default SummaryCard;