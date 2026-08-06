import { useState } from "react";


function SaleForm({ onSubmit, initialSale }) {
    const [sale, setSale] = useState(
        initialSale || {
            description: "",
            gross_amount: "",
            investment_amount: "",
            date: new Date().toISOString().split("T")[0],
        }
    );

    function handleChange(event) {
        setSale({
            ...sale,
            [event.target.name]: event.target.value,
        });
    }

    function handleSubmit(event) {
    event.preventDefault();

    onSubmit(sale);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div className="space-y-2">
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                >
                    Descripción
                </label>

                <input
                    id="description"
                    type="text"
                    name="description"
                    value={sale.description}
                    onChange={handleChange}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        px-4
                        py-3
                        text-[var(--text-primary)]
                        outline-none
                        transition
                        focus:border-[var(--primary)]
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                    "
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="gross_amount"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                >
                    Ingreso Bruto
                </label>

                    <div className="relative">
                        <span
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-[var(--text-secondary)]
                                font-medium
                            "
                        >
                            $
                        </span>

                    <input
                        id="gross_amount"
                        type="number"
                        name="gross_amount"
                        value={sale.gross_amount}
                        onChange={handleChange}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            pl-8 
                            pr-4
                            py-3
                            text-[var(--text-primary)]
                            outline-none
                            transition
                            focus:border-[var(--primary)]
                            focus:ring-2
                            focus:ring-[var(--primary)]/20
                        "
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="investment_amount"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                >
                    Inversión
                </label>

                <div className="relative">
                        <span
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-[var(--text-secondary)]
                                font-medium
                            "
                        >
                            $
                        </span>

                <input
                    id="investment_amount"
                    type="number"
                    name="investment_amount"
                    value={sale.investment_amount}
                    onChange={handleChange}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        pl-8 
                        pr-4
                        py-3
                        text-[var(--text-primary)]
                        outline-none
                        transition
                        focus:border-[var(--primary)]
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                    "
                />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="date"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                >
                    Fecha
                </label>

                <input
                    id="date"
                    type="date"
                    name="date"
                    value={sale.date}
                    onChange={handleChange}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        px-4
                        py-3
                        text-[var(--text-primary)]
                        outline-none
                        transition
                        focus:border-[var(--primary)]
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                    "
                />
            </div>

            <button
                type="submit"
                className="
                    w-full
                    rounded-xl
                    bg-[var(--primary)]
                    px-4
                    py-3
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[var(--primary-hover)]
                "
            >
                Guardar Venta
            </button>
        </form>
    );
}
export default SaleForm;