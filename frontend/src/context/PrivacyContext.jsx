import { createContext, useContext, useState, useEffect } from "react";

const PRIVACY_KEY = "privacy_mode_enabled";

const PrivacyContext = createContext({
    isPrivate: false,
    togglePrivacy: () => {},
    setPrivate: () => {},
});

export function PrivacyProvider({ children }) {
    const [isPrivate, setIsPrivate] = useState(() => {
        try {
            return localStorage.getItem(PRIVACY_KEY) === "true";
        } catch {
            return false;
        }
    });

    useEffect(() => {
        function syncPrivacy(e) {
            if (e.key === PRIVACY_KEY) {
                setIsPrivate(e.newValue === "true");
            }
        }
        window.addEventListener("storage", syncPrivacy);
        return () => window.removeEventListener("storage", syncPrivacy);
    }, []);

    function togglePrivacy() {
        setIsPrivate((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(PRIVACY_KEY, String(next));
            } catch {}
            window.dispatchEvent(new CustomEvent("privacy_mode_change", { detail: next }));
            return next;
        });
    }

    function setPrivate(enabled) {
        setIsPrivate(enabled);
        try {
            localStorage.setItem(PRIVACY_KEY, String(enabled));
        } catch {}
        window.dispatchEvent(new CustomEvent("privacy_mode_change", { detail: enabled }));
    }

    return (
        <PrivacyContext.Provider value={{ isPrivate, togglePrivacy, setPrivate }}>
            {children}
        </PrivacyContext.Provider>
    );
}

export function usePrivacy() {
    return useContext(PrivacyContext);
}

