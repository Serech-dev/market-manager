const THEME_KEY = "theme";

export function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
}

export function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || "blue";
}