"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
//import { createContext, useContext, useEffect, useState } from "react";
import * as AuthAPI from "../services/auth";
import { readAuth, writeAuth, clearAuth } from "../lib/storage";
import { apiFetch } from "@/lib/api";

const LS_TOKEN = "tapstagram_token";
const LS_USER = "tapstagram_user";

type Ctx = {
    user: any;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    setAuth: (token: string, user: any) => void;   // <-- used by register or others
    logout: () => void;
};

const AuthContext = createContext<Ctx>({
    user: null, token: null, loading: true,
    login: async () => false, setAuth: () => { }, logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = localStorage.getItem(LS_TOKEN) ?? localStorage.getItem("tapstagram_token"); // back-compat
        const u = localStorage.getItem(LS_USER) ?? localStorage.getItem("tapstagram_user");
        if (t && u) { setToken(t); setUser(JSON.parse(u)); }
        setLoading(false);
    }, []);

    const setAuth: Ctx["setAuth"] = (t, u) => {
        setToken(t);
        setUser(u);
        localStorage.setItem(LS_TOKEN, t);                 // <-- WRITE happens here
        localStorage.setItem(LS_USER, JSON.stringify(u));  // <-- and here
        // clean legacy keys
        //localStorage.removeItem("tapstagram_token");
        //localStorage.removeItem("tapstagram_user");
    };

    const login: Ctx["login"] = async (email, password) => {
        type LoginResp = { ok: true; token: string; user: any } | { ok: false; error: string };
        const res = await apiFetch<LoginResp>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        if (!("ok" in res) || !res.ok) return false;
        setAuth(res.token, res.user); // <-- sets state AND writes to localStorage
        return true;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_USER);

        // backward-compat cleanup
        localStorage.removeItem("tapstagram_token");
        localStorage.removeItem("tapstagram_user");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() { return useContext(AuthContext); }
