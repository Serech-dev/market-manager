import { useState } from "react";
import { themes } from "../themes/themes";
import { getSavedTheme, setTheme } from "../utils/theme";

function ThemeSelector() {
    const [theme, setCurrentTheme] = useState(getSavedTheme());

    function handleChange(event) {
        const newTheme = event.target.value;

        setTheme(newTheme);
        setCurrentTheme(newTheme);
    }

    return (
        <div className="w-full">
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
                {themes.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );

}

export default ThemeSelector;