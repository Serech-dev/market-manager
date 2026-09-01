import { Link, useLocation } from "react-router-dom";
import { ReceiptText, Package, Tags, Plus } from "lucide-react";

function AppNavigation() {
    const location = useLocation();
    const currentPath = location.pathname;

    const isDashboard = currentPath === "/";
    const isProducts = currentPath === "/products" || (currentPath.startsWith("/products/") && !currentPath.includes("categories"));
    const isCategories = currentPath === "/categories" || currentPath.includes("categories");

    const navItemClass = (active) =>
        `flex flex-col items-center justify-center flex-1 py-1.5 px-2 transition-all active-press ${
            active
                ? "text-[var(--primary)] font-bold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
        }`;

    return (
        <nav
            aria-label="Main Navigation"
            className="
                fixed
                bottom-0
                left-0
                right-0
                z-30
                border-t
                border-[var(--border)]
                bg-[var(--surface)]/95
                backdrop-blur-md
                pb-safe
                shadow-[0_-4px_16px_rgba(0,0,0,0.04)]
            "
        >
            <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1">
                {/* Sales / Dashboard */}
                <Link
                    to="/"
                    className={navItemClass(isDashboard)}
                >
                    <div className={`p-1 rounded-xl transition-colors ${isDashboard ? "bg-[var(--surface-accent)]" : ""}`}>
                        <ReceiptText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">Ventas</span>
                </Link>

                {/* Products */}
                <Link
                    to="/products"
                    className={navItemClass(isProducts)}
                >
                    <div className={`p-1 rounded-xl transition-colors ${isProducts ? "bg-[var(--surface-accent)]" : ""}`}>
                        <Package className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">Productos</span>
                </Link>

                {/* Central Quick Add Action */}
                <Link
                    to="/new-sale"
                    className="
                        -mt-5
                        flex
                        flex-col
                        items-center
                        justify-center
                        group
                    "
                    aria-label="Nueva Venta"
                >
                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--primary)]
                            text-white
                            shadow-lg
                            shadow-[var(--primary)]/30
                            transition-transform
                            active-press
                            group-hover:bg-[var(--primary-hover)]
                            group-hover:scale-105
                        "
                    >
                        <Plus className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <span className="text-[11px] font-bold text-[var(--primary)] mt-1 tracking-tight">
                        + Venta
                    </span>
                </Link>

                {/* Categories */}
                <Link
                    to="/categories"
                    className={navItemClass(isCategories)}
                >
                    <div className={`p-1 rounded-xl transition-colors ${isCategories ? "bg-[var(--surface-accent)]" : ""}`}>
                        <Tags className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">Categorías</span>
                </Link>
            </div>
        </nav>
    );
}

export default AppNavigation;