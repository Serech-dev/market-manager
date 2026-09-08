/**
 * Bambi Easter Egg & Overseer Configuration
 * Exclusively active for authorized user accounts.
 */

export const BAMBI_AUTHORIZED_USERS = [
    "serech@test.com",
    // Add friend's email here
];

export function isBambiAuthorized(user) {
    let email = user?.email;
    if (!email) {
        try {
            const stored = JSON.parse(localStorage.getItem("authUser") || "null");
            email = stored?.email;
        } catch {
            email = null;
        }
    }
    if (!email) return false;
    return BAMBI_AUTHORIZED_USERS.some(
        (authorized) => authorized.toLowerCase().trim() === email.toLowerCase().trim()
    );
}

export function isBambiVisible() {
    try {
        const stored = localStorage.getItem("bambi_visible");
        if (stored === null) return true; // Default ON for authorized users
        return stored === "true";
    } catch {
        return true;
    }
}

export function setBambiVisible(enabled) {
    try {
        localStorage.setItem("bambi_visible", String(enabled));
        window.dispatchEvent(new Event("bambi_visibility_change"));
    } catch {}
}

export function isBambiEnabled(user) {
    return isBambiAuthorized(user) && isBambiVisible();
}

/**
 * 1:1 Pairings of Cutout Images to Inside Joke Phrases & Contexts
 */
export const BAMBI_MOMENTS = [
    {
        id: "caradebambi",
        phrase: "*Cara de Bambi*",
        image: "/bambi/caradebambi.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "buenoestabien",
        phrase: "Buenoestábien.",
        image: "/bambi/buenoestabien.webp",
        categories: ["positive_close", "sale", "pokes"],
    },
    {
        id: "enfin",
        phrase: "En fin, la hipocresia",
        image: "/bambi/enfin.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "fantasmita",
        phrase: "Tío Baaaarian",
        image: "/bambi/fantasmita.webp",
        categories: ["pokes"],
    },
    {
        id: "tiobarian",
        phrase: "Tío Baaaarian",
        image: "/bambi/tiobarian.webp",
        categories: ["pokes"],
    },
    {
        id: "textrañosaurio",
        phrase: "Dinosaurio textrañosaurio",
        image: "/bambi/textrañosaurio.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "lapucaracha",
        phrase: "La pucaracha",
        image: "/bambi/lapucaracha.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "lapucaracha2",
        phrase: "La pucaracha!",
        image: "/bambi/lapucaracha2.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "waoooo",
        phrase: "Wuaooooo",
        image: "/bambi/waoooo.webp",
        categories: ["positive_close", "sale", "pokes"],
    },
    {
        id: "nosoyunrobot",
        phrase: "Recuerda: No soy un robot tío Barian",
        image: "/bambi/nosoyunrobot.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "nopuedeser",
        phrase: "No puede ser...",
        image: "/bambi/nopuedeser.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "furbydeberias",
        phrase: "Deberías...",
        image: "/bambi/furbydeberias.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "bambilengua",
        phrase: "Claro que si mamá!",
        image: "/bambi/bambilengua.webp",
        categories: ["positive_close", "sale", "pokes"],
    },
    {
        id: "bambi_1",
        phrase: "Claro que si!",
        image: "/bambi/bambi_1.webp",
        categories: ["positive_close", "sale", "pokes"],
    },
    {
        id: "bambianotando",
        phrase: "Anotando ventas...",
        image: "/bambi/bambianotando.webp",
        categories: ["sale", "pokes"],
    },
    {
        id: "bambiamogus",
        phrase: "Among Us Bambi",
        image: "/bambi/bambiamogus.webp",
        categories: ["pokes"],
    },
    {
        id: "bambiserio",
        phrase: "Inspección de finanzas",
        image: "/bambi/bambiserio.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "bambicumple",
        phrase: "¡Festejo de jornada!",
        image: "/bambi/bambicumple.webp",
        categories: ["positive_close", "pokes"],
    },
    {
        id: "bambicarita",
        phrase: "Bambi te observa",
        image: "/bambi/bambicarita.webp",
        categories: ["negative_close", "pokes"],
    },
    {
        id: "bambicarita2",
        phrase: "Bambi feliz",
        image: "/bambi/bambicarita2.webp",
        categories: ["positive_close", "pokes", "sale"],
    },
    {
        id: "bambiraro",
        phrase: "Bambi modo raro",
        image: "/bambi/bambiraro.webp",
        categories: ["negative_close", "pokes"],
    },
];

export function getRandomBambiMoment(category = "pokes") {
    const matching = BAMBI_MOMENTS.filter(
        (m) => !category || m.categories.includes(category)
    );
    const list = matching.length > 0 ? matching : BAMBI_MOMENTS;
    return list[Math.floor(Math.random() * list.length)];
}

export function getRandomBambiPhrase(category = "sale") {
    const moment = getRandomBambiMoment(category);
    return moment?.phrase || "Claro que si mamá!";
}

export function getCloseoutBambiMoment(summary, sales = []) {
    const earnings = Number(summary?.earnings || 0);
    const gross = Number(summary?.gross || 0);
    const salesCount = (sales || []).length;

    const isPositive = earnings > 0 && gross > 0 && salesCount > 0;
    const category = isPositive ? "positive_close" : "negative_close";
    return {
        moment: getRandomBambiMoment(category),
        isPositive,
    };
}
