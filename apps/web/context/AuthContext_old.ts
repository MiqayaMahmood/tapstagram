// apps/web/src/context/AuthContext.tsx (sketch)
import React, { createContext, useContext, useEffect, useState } from 'react';
type Ctx = {
    user: any; token: string | null; loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
};
const AuthContext = createContext<Ctx>({ user: null, token: null, loading: true, login: async () => false, logout: () => { } });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('user');
        if (t && u) { setToken(t); setUser(JSON.parse(u)); }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await (await import('@/services/auth')).login(email, password);
            setToken(res.token); setUser(res.user);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            return true;
        } catch {
            return false;
        }
    };

    const logout = () => {
        setToken(null); setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return <AuthContext.Provider value={ { user, token, loading, login: login, logout } }> { children } < /AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
