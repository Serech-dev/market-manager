import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";


function CreateMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div
            ref={menuRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="
                    inline-flex
                    items-center
                    rounded-lg
                    bg-[var(--primary)]
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[var(--primary-hover)]
                "
            >
                + Crear Nuevo
            </button>

            {isOpen && (
                <div
                    className="
                        absolute
                        right-0
                        z-20
                        mt-2
                        w-max
                        min-w-full
                        overflow-hidden
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-1
                        text-center
                        shadow-lg
                    "
                >
                    <Link
                        to="/products/new"
                        onClick={() => setIsOpen(false)}
                        className="
                            block
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-[var(--text-primary)]
                            transition
                            hover:bg-[var(--surface-accent)]
                        "
                    >
                        Producto
                    </Link>

                    <Link
                        to="/products/categories/new"
                        onClick={() => setIsOpen(false)}
                        className="
                            block
                            w-full
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-[var(--text-primary)]
                            transition
                            hover:bg-[var(--surface-accent)]
                        "
                    >
                        Categoría
                    </Link>
                </div>
            )}
        </div>
    );
}

export default CreateMenu;