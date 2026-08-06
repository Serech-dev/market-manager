function SummaryCard({ title, value }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-stone-300 p-5 shadow-sm">

            <p className="text-sm text-slate-500">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-800">
                ${value}
            </p>

        </div>
    );
}

export default SummaryCard;