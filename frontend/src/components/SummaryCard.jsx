function SummaryCard({ title, value }) {
    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500">
                {title}
            </h2>

            <p className="mt-2 text-2xl font-bold text-gray-900">
                ${value}
            </p>
        </div>
    );
}

export default SummaryCard;