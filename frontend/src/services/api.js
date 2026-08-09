import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export function getApiError(
    error,
    fallback = "Ocurrió un error."
) {
    const data = error.response?.data;

    if (!data) {
        return fallback;
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.detail) {
        return data.detail;
    }

    const messages = Object.values(data).flat();

    if (messages.length > 0) {
        return messages.join(" ");
    }

    return fallback;
}

export default api;