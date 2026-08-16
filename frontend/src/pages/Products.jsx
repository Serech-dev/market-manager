import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateMenu from "../components/CreateMenu";
import api, { getApiError } from "../services/api";
import AccountMenu from "../components/AccountMenu";
import AppNavigation from "../components/AppNavigation";
import { formatCurrency } from "../utils/formatCurrency";
import { capitalizeWords } from "../utils/capitalizeWords";


function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [sort, setSort] = useState("name");
    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get(
                    `products/?sort=${sort}`
                );

                setProducts(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    getApiError(
                        error,
                        "No se pudieron cargar los productos."
                    )
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, [sort]);

    const filteredProducts = products.filter((product) =>
        product.name.includes(search.trim().toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--surface)] px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">

                <header className="flex min-h-[72px] items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                            Productos
                        </h1>

                        <p className="mt-1 text-[var(--text-secondary)]">
                            Registro de productos vendidos
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-center gap-2">
                        <AccountMenu user={user} />

                        <CreateMenu />
                    </div>
                </header>

                <AppNavigation />

                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">

                    <Link
                        to="/categories"
                        className="
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            px-4
                            py-3
                            text-center
                            font-medium
                            text-[var(--text-primary)]
                            transition
                            hover:border-[var(--primary)]
                            hover:text-[var(--primary)]
                        "
                    >
                        Categorías
                    </Link>
                    
                    <input
                        type="search"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            px-4
                            py-3
                            text-[var(--text-primary)]
                            outline-none
                            focus:border-[var(--primary)]
                        "
                    >
                        <option value="name">A–Z</option>
                        <option value="sales">Más vendidos</option>
                        <option value="gross">Mayor ingreso</option>
                        <option value="earnings">Mayor ganancia</option>
                        <option value="recent">Venta más reciente</option>
                        <option value="oldest">Producto más antiguo</option>
                    </select>
                </div>

                {isLoading && (
                    <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
                        <p className="text-[var(--text-secondary)]">
                            Cargando productos...
                        </p>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
                        <p className="text-[var(--text-primary)]">
                            {error}
                        </p>
                    </div>
                )}

                {!isLoading && !error && filteredProducts.length === 0 && (
                    <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
                        <p className="text-lg font-medium text-[var(--text-primary)]">
                            No se encontraron productos.
                        </p>

                        <p className="mt-2 text-[var(--text-secondary)]">
                            {search
                                ? "Prueba con otro término de búsqueda."
                                : "Los productos aparecerán aquí cuando registres ventas."}
                        </p>
                    </div>
                )}

                {!isLoading && !error && filteredProducts.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2]">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="
                                    rounded-2xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-5
                                    shadow-sm
                                    transition
                                    hover:-translate-y-0.5
                                    hover:shadow-md
                                "
                            >
                                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                    {capitalizeWords(product.name)}
                                </h2>

                                {product.category_name && (
                                    <p className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">
                                        {capitalizeWords(product.category_name)}
                                    </p>
                                )}

                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Ventas
                                        </span>

                                        <span className="font-semibold text-[var(--text-primary)]">
                                            {product.sales_count}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Ingresos
                                        </span>

                                        <span className="font-semibold text-[var(--text-primary)]">
                                            {formatCurrency(product.gross)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Ganancia
                                        </span>

                                        <span className="font-semibold text-[var(--success)]">
                                            {formatCurrency(product.earnings)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">
                                            Última venta
                                        </span>

                                        <span className="font-medium text-[var(--text-primary)]">
                                            {product.last_sale || "Sin ventas"}
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                    Ver estadísticas del producto
                                </p>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Products;