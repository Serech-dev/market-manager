import { useState, useRef, useEffect } from "react";
import { themes } from "../themes/themes";
import { getSavedTheme, setTheme } from "../utils/theme";
import { ChevronDown, Check } from "lucide-react";

function ThemeSelector() {
    const [currentThemeId, setCurrentThemeId] = useState(getSavedTheme());
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const activeTheme = themes.find((t) => t.id === currentThemeId) || themes[0];

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

            {/* Expanded List */}
            {isOpen && (
                <div
                    className="
                        mt-1.5
                        max-h-48
                        overflow-y-auto
                        space-y-0.5
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-1
                        shadow-md
                        custom-scrollbar
                    "
                >
                    {themes.map((item) => {
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
            )}
        </div>
    );
}

export default ThemeSelector;