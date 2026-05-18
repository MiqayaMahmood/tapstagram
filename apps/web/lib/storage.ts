export const LS_TOKEN = "tapstagram_token";
export const LS_USER = "tapstagram_user";

export function readAuth() {
    try {
        const token = localStorage.getItem(LS_TOKEN);
        const raw = localStorage.getItem(LS_USER);
        const user = raw ? JSON.parse(raw) : null;
        return { token, user };
    } catch { return { token: null, user: null }; }
}

export function writeAuth(token: string, user: any) {
    localStorage.setItem(LS_TOKEN, token);
    localStorage.setItem(LS_USER, JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    // backward-compat cleanup
    localStorage.removeItem("tapstagram_token");
    localStorage.removeItem("tapstagram_user");
}
