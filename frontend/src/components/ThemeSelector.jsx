import { useState } from "react";
import { getThemesForUser } from "../themes/themes";
import { getSavedTheme, setTheme } from "../utils/theme";
import { isVipUser } from "../utils/userPerks";

function ThemeSelector({ user }) {
    const [theme, setCurrentTheme] = useState(getSavedTheme());
    const availableThemes = getThemesForUser(user);
    const isVip = isVipUser(user);

    function handleChange(event) {
        const newTheme = event.target.value;

        setTheme(newTheme);
        setCurrentTheme(newTheme);
    }

    return (
        <div className="w-full space-y-1.5">
            <select
                id="theme"
                value={theme}
                onChange={handleChange}
                className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface-accent)]/50
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-[var(--text-primary)]
                    outline-none
                    transition
                    cursor-pointer
                    focus:border-[var(--primary)]
                    focus:ring-2
                    focus:ring-[var(--primary)]/20
                "
            >
                {availableThemes.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
            {isVip && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--primary)] px-0.5">
                    <span>👑 Temas exclusivos activos</span>
                </div>
            )}
        </div>
    );
}

export default ThemeSelector;