// VIP & Exclusive User Configuration
// Easily add usernames/emails here to grant exclusive themes and features.

export const VIP_ACCOUNTS = [
    "serech@test.com",
    // Add friend's email here when configured
];

/**
 * Checks if the provided or stored user has VIP privileges
 */
export function isVipUser(user) {
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
    return VIP_ACCOUNTS.some((v) => v.toLowerCase().trim() === email.toLowerCase().trim());
}
