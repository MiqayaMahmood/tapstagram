export async function uploadImage(file: File, token?: string) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
        method: "POST",
        body: form,
        credentials: "include",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
            if (contentType.includes("application/json")) {
                const j = await res.json();
                message = j.error || j.message || message;
            } else {
                const txt = await res.text();
                if (txt) message = txt;
            }
        } catch { }
        throw new Error(message);
    }

    return res.json() as Promise<{ ok: true; url: string; key: string }>;
}