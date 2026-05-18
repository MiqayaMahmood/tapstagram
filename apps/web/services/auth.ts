// apps/web/services/auth.ts
import { apiFetch } from '@/lib/api';

export type AuthUser = { error: false; success: true; id: number; email: string; is_business: boolean; created_at: string; name?: string | null };
type LoginResp = { error: false; success: true; token: string; user: AuthUser } | { success: false; error: string };
type RegisterResp = { error: false; success: true; token: string; user: AuthUser } | { success: false; error: string };

export type User = { id: number; email: string; name: string | null; is_business: boolean; created_at: string;};

export async function loginFn(email: string, password: string) {
    
    const res = await apiFetch<LoginResp>("/auth/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!("success" in res) || !res.success) throw new Error(res?.error || "Invalid credentials");
    return res;
}

export async function registerFn(payload: { email: string; password: string; name?: string; is_business?: number }) {
    try {
            const res = await apiFetch<RegisterResp>("/auth/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!("success" in res) || !res.success) throw new Error(res?.error || "Registration failed");
            return res;

        } catch (err: any) {
            throw new Error("Registration failed: " + err.message);
        }
    
}

