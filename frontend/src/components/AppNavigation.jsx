import { Link, useLocation } from "react-router-dom";


function AppNavigation() {
    const location = useLocation();

    const isProducts = location.pathname.startsWith("/products");

    const buttonClass = (active) =>
        `flex-1 rounded-lg py-3 text-center font-semibold transition ${
            active
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-accent)]"
        }`;

    return (
        <nav className="flex gap-2">
            <Link
                to="/"
                className={buttonClass(!isProducts)}
            >
                Ventas
            </Link>

            <Link
                to="/products"
                className={buttonClass(isProducts)}
            >
                Productos
            </Link>
        </nav>
    );
}

export default AppNavigation;