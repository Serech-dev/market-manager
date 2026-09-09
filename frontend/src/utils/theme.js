const THEME_KEY = "theme";

const VALID_THEMES = [
    "blue",
    "cherry",
    "forest",
    "midnight",
    "cherry-dark",
    "forest-dark",
    "cosmic",
];

const THEME_ALIASES = {
    dark: "midnight",
    sunset: "cherry",
    lavender: "cherry",
    sky: "blue",
    meadow: "forest",
    ember: "cherry-dark",
    evergreen: "forest-dark",
    cosmic_noir: "cosmic",
    space: "cosmic",
};


export const THEME_BACKGROUND_COLORS = {
    cosmic: "#0d0c1d",
    blue: "#e9e9e5",
    cherry: "#f7e8ed",
    forest: "#eeede5",
    midnight: "#171b22",
    "forest-dark": "#151c19",
    "cherry-dark": "#1d171b",
};

const DEFAULT_THEME = "cosmic";

export function getSavedTheme() {
    try {
        const rawTheme = localStorage.getItem(THEME_KEY);
        if (!rawTheme) return DEFAULT_THEME;

        const normalized = rawTheme.toLowerCase().trim();
        if (VALID_THEMES.includes(normalized)) {
            return normalized;
        }
        if (THEME_ALIASES[normalized]) {
            return THEME_ALIASES[normalized];
        }
        return DEFAULT_THEME;
    } catch {
        return DEFAULT_THEME;
    }
}

export function setTheme(theme) {
    let targetTheme = DEFAULT_THEME;
    const normalized = (theme || "").toLowerCase().trim();

    if (VALID_THEMES.includes(normalized)) {
        targetTheme = normalized;
    } else if (THEME_ALIASES[normalized]) {
        targetTheme = THEME_ALIASES[normalized];
    }

    document.documentElement.setAttribute("data-theme", targetTheme);
    document.documentElement.dataset.theme = targetTheme;

    try {
        localStorage.setItem(THEME_KEY, targetTheme);
    } catch (e) {
        console.warn("Could not save theme to localStorage", e);
    }

    // Sync theme-color meta tag with the active theme background for seamless status bar / PWA header
    const bgColor =
        THEME_BACKGROUND_COLORS[targetTheme] ||
        getComputedStyle(document.documentElement)
            .getPropertyValue("--background")
            .trim() ||
        "#0d0c1d";

    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
        themeColor = document.createElement("meta");
        themeColor.name = "theme-color";
        document.head.appendChild(themeColor);
    }
    themeColor.setAttribute("content", bgColor);
}
