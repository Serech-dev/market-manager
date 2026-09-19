import { useState } from "react";
import { themes } from "../themes/themes";
import { getSavedTheme, setTheme } from "../utils/theme";
import { Check } from "lucide-react";

function ThemeSelector() {
    const [currentThemeId, setCurrentThemeId] = useState(getSavedTheme());

    function handleSelect(themeId) {
        setTheme(themeId);
        setCurrentThemeId(themeId);
    }

    return (
        <div className="grid grid-cols-2 gap-1.5 pt-1">
            {themes.map((item, index) => {
                const isSelected = item.id === currentThemeId;
                const isLastOdd = index === themes.length - 1 && themes.length % 2 !== 0;

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`
                            flex
                            items-center
                            justify-between
                            gap-1.5
                            rounded-xl
                            border
                            px-2.5
                            py-1.5
                            text-left
                            text-[11px]
                            transition
                            active-press
                            ${isLastOdd ? "col-span-2 justify-center" : ""}
                            ${
                                isSelected
                                    ? "border-[var(--primary)] bg-[var(--primary)] text-white font-bold shadow-2xs"
                                    : "border-[var(--border)] bg-[var(--surface-accent)] text-[var(--text-primary)] font-semibold hover:border-[var(--primary)]/40 hover:bg-[var(--surface-accent)]/80"
                            }
                        `}
                    >
                        <span className="flex items-center gap-1.5 min-w-0">
                            <span
                                className={`h-2.5 w-2.5 rounded-full shrink-0 ring-1 ${
                                    isSelected
                                        ? "ring-white/60"
                                        : "ring-[var(--border)]"
                                }`}
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate">{item.name}</span>
                        </span>

                        {isSelected && (
                            <Check className="w-3 h-3 shrink-0" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default ThemeSelector;