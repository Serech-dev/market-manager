import { isVipUser } from "../utils/userPerks";

export const standardThemes = [
    {
        id: "blue",
        name: "Sky",
    },
    {
        id: "cherry",
        name: "Cherry",
    },
    {
        id: "forest",
        name: "Meadow",
    },
    {
        id: "midnight",
        name: "Midnight",
    },
    {
        id: "cherry-dark",
        name: "Ember",
    },
    {
        id: "forest-dark",
        name: "Evergreen",
    },
];

export const vipThemes = [
    {
        id: "aurora",
        name: "✨ Aurora",
        vipOnly: true,
    },
    {
        id: "rosegold",
        name: "✨ Rose Gold",
        vipOnly: true,
    },
    {
        id: "cosmic",
        name: "✨ Cosmic Noir",
        vipOnly: true,
    },
];

export const themes = [...standardThemes, ...vipThemes];

export function getThemesForUser(user) {
    if (isVipUser(user)) {
        return [...standardThemes, ...vipThemes];
    }
    return standardThemes;
}


