'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';


const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('tapstagram_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('tapstagram_token', data.token);
            localStorage.setItem('tapstagram_user', JSON.stringify(data.user));
            setUser(data.user);
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('tapstagram_token');
        localStorage.removeItem('tapstagram_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
