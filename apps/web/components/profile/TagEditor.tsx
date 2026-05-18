"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyTags, searchTags, updateMyTags } from "@/services/profile";

export default function TagEditor() {
    const { token } = useAuth();
    const [tags, setTags] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    // load my tags
    useEffect(() => {
        if (!token) return;
        (async () => {
            const names = await getMyTags(token);
            setTags(names);
        })();
    }, [token]);

    // typeahead
    useEffect(() => {
        let active = true;
        (async () => {
            const q = input.trim();
            if (!q) return setSuggestions([]);
            const items = await searchTags(q);
            if (active) setSuggestions(items.filter((n) => !tags.includes(n.toLowerCase())));
            //const res = await apiFetch<{ items: { id: number; name: string }[] }>(`/tags/search?q=${encodeURIComponent(q)}`);
            //if (active) setSuggestions(res.items.map((x) => x.name).filter((n) => !tags.includes(n)));
        })();
        return () => { active = false; };
    }, [input, tags]);

    const addTag = (name: string) => {
        const n = name.trim();
        if (!n || tags.includes(n)) return;
        setTags((prev) => [...prev, n]);
        setInput("");
        setSuggestions([]);
    };
    const removeTag = (name: string) => setTags((prev) => prev.filter((t) => t !== name));

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
        }
    };

    const save = async () => {
        if (!token) return;
        setSaving(true);
        try {
            await updateMyTags(token, tags);
            //await apiFetch<{ ok: true }>("/profiles/me/tags", {
            //    method: "PATCH",
            //    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            //    body: JSON.stringify({ tags }),
            //});
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="font-medium">Tags</div>
            <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-1 border rounded-full text-sm">
                        {t}
                        <button className="text-neutral-500 hover:text-black" onClick={() => removeTag(t)}>×</button>
                    </span>
                ))}
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Add a tag and press Enter"
                    className="px-2 py-1 border rounded text-sm"
                />
            </div>
            {!!suggestions.length && (
                <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 8).map((s) => (
                        <button
                            key={s}
                            onClick={() => addTag(s)}
                            className="px-2 py-1 border rounded text-xs hover:bg-neutral-50"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex justify-end">
                <button onClick={save} disabled={saving} className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60">
                    {saving ? "Saving…" : "Save tags"}
                </button>
            </div>
        </div>
    );
}
