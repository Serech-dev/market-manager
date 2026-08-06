function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="
                fixed inset-0
                flex items-center justify-center
                bg-black/40
                p-4
            "
        >
            <div
                className="
                    w-full
                    max-w-sm
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    shadow-xl
                "
            >
                <h2
                    className="
                        text-xl
                        font-bold
                        text-[var(--text-primary)]
                    "
                >
                    {title}
                </h2>

                <p
                    className="
                        mt-2
                        text-[var(--text-secondary)]
                    "
                >
                    {message}
                </p>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="
                            flex-1
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            py-3
                            font-semibold
                            text-[var(--text-primary)]
                            transition
                            hover:bg-[var(--surface-accent)]
                        "
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="
                            flex-1
                            rounded-xl
                            bg-[var(--danger)]
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:brightness-90
                        "
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;