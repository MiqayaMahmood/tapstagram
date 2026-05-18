import { apiFetch } from "@/lib/api";

type LoginResp =
    | { success: true; token: string; user: { id: number; email: string; is_business: boolean; name?: string | null } }
    | { success: false; error: string };

export async function loginToApi(email: string, password: string): Promise<boolean> {
    const data = await apiFetch<LoginResp>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (data.success) {
        localStorage.setItem("tapstagram_token", data.token);
        localStorage.setItem("tapstagram_user", JSON.stringify(data.user));
        return true;
    }
    throw new Error("Invalid email or password");
}
