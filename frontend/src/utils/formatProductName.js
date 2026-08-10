export function formatProductName(name) {
    return name
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}