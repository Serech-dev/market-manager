import { logout } from "../services/auth";
import ThemeSelector from "./ThemeSelector";
import OnboardingModal from "./OnboardingModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User, Palette, LogOut, ChevronDown, HelpCircle, Volume2, VolumeX, Sparkles } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playPopSound } from "../utils/soundEffects";
import { isBambiAuthorized, isBambiVisible, setBambiVisible } from "../utils/bambiConfig";

function AccountMenu({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
    const [bambiOn, setBambiOn] = useState(() => isBambiVisible());
    const menuRef = useRef(null);
    const navigate = useNavigate();

    function toggleSound() {
        const nextState = !soundOn;
        setSoundOn(nextState);
        setSoundEnabled(nextState);
        if (nextState) {
            playPopSound();
        }
    }

    function toggleBambi() {
        const nextState = !bambiOn;
        setBambiOn(nextState);
        setBambiVisible(nextState);
        if (nextState) {
            playPopSound();
        }
    }


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
                        p-3.5
                        shadow-xl
                        animate-pop-in
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

                    {/* Sound Effects Toggle */}
                    <div className="border-t border-[var(--border)] py-2">
                        <button
                            type="button"
                            onClick={toggleSound}
                            className="
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-xl
                                px-2.5
                                py-2
                                text-xs
                                font-bold
                                text-[var(--text-primary)]
                                transition
                                active-press
                                hover:bg-[var(--surface-accent)]
                            "
                        >
                            <span className="flex items-center gap-2">
                                {soundOn ? (
                                    <Volume2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                                ) : (
                                    <VolumeX className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                                )}
                                <span>Sonidos</span>
                            </span>
                            <span
                                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                    soundOn
                                        ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                                        : "bg-[var(--surface-accent)] text-[var(--text-secondary)]"
                                }`}
                            >
                                {soundOn ? "ON" : "OFF"}
                            </span>
                        </button>
                    </div>

                    {/* Bambi Easter Egg Toggle (Only for authorized accounts) */}
                    {isBambiAuthorized(user) && (
                        <div className="border-t border-[var(--border)] py-2">
                            <button
                                type="button"
                                onClick={toggleBambi}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-xl
                                    px-2.5
                                    py-2
                                    text-xs
                                    font-bold
                                    text-[var(--text-primary)]
                                    transition
                                    active-press
                                    hover:bg-[var(--surface-accent)]
                                "
                            >
                                <span className="flex items-center gap-2">
                                    <img
                                        src="/bambi/caradebambi.webp"
                                        alt="Bambi"
                                        className="w-4 h-4 object-contain filter drop-shadow-xs"
                                    />
                                    <span>Bambi</span>
                                </span>
                                <span
                                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                        bambiOn
                                            ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                                            : "bg-[var(--surface-accent)] text-[var(--text-secondary)]"
                                    }`}
                                >
                                    {bambiOn ? "ON" : "OFF"}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Usage Guide / Tutorial */}
                    <div className="border-t border-[var(--border)] py-2">

                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                setShowGuide(true);
                            }}
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
                                text-[var(--text-primary)]
                                transition
                                active-press
                                hover:bg-[var(--surface-accent)]
                            "
                        >
                            <HelpCircle className="w-3.5 h-3.5 text-[var(--primary)]" />
                            <span>Guía de uso</span>
                        </button>
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

            {/* Onboarding / Tutorial Modal */}
            <OnboardingModal
                isOpen={showGuide}
                onClose={() => setShowGuide(false)}
            />
        </div>
    );
}

export default AccountMenu;

