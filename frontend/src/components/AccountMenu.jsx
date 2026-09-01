import { logout } from "../services/auth";
import ThemeSelector from "./ThemeSelector";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User, Palette, LogOut, ChevronDown } from "lucide-react";

function AccountMenu({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-1.5
                    pr-2.5
                    text-xs
                    font-semibold
                    text-[var(--text-primary)]
                    shadow-sm
                    transition
                    active-press
                    hover:border-[var(--primary)]/50
                "
            >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--primary)] text-xs font-extrabold text-white">
                    {initial}
                </div>

                <ChevronDown
                    className={`
                        w-3.5
                        h-3.5
                        text-[var(--text-secondary)]
                        transition-transform
                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>

            {isOpen && (
                <div
                    className="
                        absolute
                        right-0
                        z-40
                        mt-2
                        w-52
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-3
                        shadow-xl
                    "
                >
                    {/* User Info */}
                    <div className="flex items-center gap-2.5 pb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-accent)] text-[var(--primary)] shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                Cuenta
                            </p>
                            <p
                                className="truncate text-xs font-semibold text-[var(--text-primary)]"
                                title={user?.email}
                            >
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Theme Picker */}
                    <div className="border-t border-[var(--border)] py-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                            <Palette className="w-3.5 h-3.5 text-[var(--primary)]" />
                            <span>Tema de color</span>
                        </div>
                        <ThemeSelector />
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[var(--border)] pt-2">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                rounded-xl
                                px-2.5
                                py-2
                                text-xs
                                font-bold
                                text-[var(--danger)]
                                transition
                                active-press
                                hover:bg-[var(--danger-bg)]
                            "
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountMenu;