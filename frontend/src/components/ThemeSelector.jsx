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
        <div>
            <label
                htmlFor="theme"
                className="block text-sm font-medium text-[var(--text-primary)]"
            >
                Tema
            </label>

            <select
                id="theme"
                value={theme}
                onChange={handleChange}
                className="
                    mt-1
                    rounded-lg
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    px-3
                    py-2
                    text-sm
                    text-[var(--text-primary)]
                    outline-none
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