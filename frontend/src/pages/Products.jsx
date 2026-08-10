import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiError } from "../services/api";
import AppNavigation from "../components/AppNavigation";
import { formatCurrency } from "../utils/formatCurrency";
import { formatProductName } from "../utils/formatProductName";


function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get("products/");
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
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.includes(search.trim().toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--surface)] px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">

                <header className="min-h-[72px]">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Productos
                    </h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Registro de productos vendidos
                    </p>
                </header>

                <AppNavigation />

                <div>
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
                    <div className="grid gap-4 sm:grid-cols-2">
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
                                    {formatProductName(product.name)}
                                </h2>

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