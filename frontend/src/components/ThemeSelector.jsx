import { useState, useRef, useEffect } from "react";
import { themes } from "../themes/themes";
import { getSavedTheme, setTheme } from "../utils/theme";
import { ChevronDown, Check, Sparkles } from "lucide-react";

function ThemeSelector() {
    const [currentThemeId, setCurrentThemeId] = useState(getSavedTheme());
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const activeTheme = themes.find((t) => t.id === currentThemeId) || themes[0];
    const standardThemes = themes.filter((t) => t.category === "standard");
    const premiumThemes = themes.filter((t) => t.category === "premium");

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelect(themeId) {
        setTheme(themeId);
        setCurrentThemeId(themeId);
        setIsOpen(false);
    }

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface-accent)]
                    px-2.5
                    py-2
                    text-xs
                    font-bold
                    text-[var(--text-primary)]
                    transition
                    active-press
                    hover:border-[var(--primary)]/50
                "
            >
                <span className="flex items-center gap-2 min-w-0">
                    <span
                        className="h-3 w-3 rounded-full shrink-0 shadow-2xs ring-1 ring-[var(--border)]"
                        style={{ backgroundColor: activeTheme.color }}
                    />
                    <span className="truncate">{activeTheme.name}</span>
                    {activeTheme.category === "premium" && (
                        <span className="flex items-center gap-0.5 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-500">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>PRO</span>
                        </span>
                    )}
                </span>

                <ChevronDown
                    className={`
                        w-3.5
                        h-3.5
                        text-[var(--text-secondary)]
                        transition-transform
                        duration-200
                        shrink-0
                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>

            {/* Dropdown Menu (No inner scrollbar) */}
            {isOpen && (
                <div
                    className="
                        mt-1.5
                        space-y-2
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-1.5
                        shadow-lg
                        animate-pop-in
                    "
                >
                    {/* Standard Themes */}
                    <div className="space-y-0.5">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Estándar
                        </div>
                        {standardThemes.map((item) => {
                            const isSelected = item.id === currentThemeId;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item.id)}
                                    className={`
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        rounded-lg
                                        px-2
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        transition
                                        ${
                                            isSelected
                                                ? "bg-[var(--primary)] text-white font-bold shadow-2xs"
                                                : "text-[var(--text-primary)] hover:bg-[var(--surface-accent)]"
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2">
                                        <span
                                            className={`h-2.5 w-2.5 rounded-full shrink-0 ring-1 ${
                                                isSelected
                                                    ? "ring-white/50"
                                                    : "ring-[var(--border)]"
                                            }`}
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span>{item.name}</span>
                                    </span>

                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Premium Themes Section */}
                    <div className="border-t border-[var(--border)] pt-1.5 space-y-0.5">
                        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Premium</span>
                            </span>
                            <span className="text-[9px] font-extrabold rounded-sm bg-amber-500/10 px-1 py-0.2">
                                EXCLUSIVO
                            </span>
                        </div>
                        {premiumThemes.map((item) => {
                            const isSelected = item.id === currentThemeId;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item.id)}
                                    className={`
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        rounded-lg
                                        px-2
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        transition
                                        ${
                                            isSelected
                                                ? "bg-[var(--primary)] text-white font-bold shadow-2xs"
                                                : "text-[var(--text-primary)] hover:bg-[var(--surface-accent)]"
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2">
                                        <span
                                            className={`h-2.5 w-2.5 rounded-full shrink-0 ring-1 ${
                                                isSelected
                                                    ? "ring-white/50"
                                                    : "ring-[var(--border)]"
                                            }`}
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span>{item.name}</span>
                                    </span>

                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThemeSelector;