"use client";
import { useAuth } from '@/context/AuthContext';

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
} from "react";
import {
    checkUsernameAvailability,
    updateMyUsername,
    type UsernameCheckResult,
} from "@/services/profile";

// Replace with your real token source (NextAuth/session/context)
//function useAccessToken() {
//    if (typeof window === "undefined") return "";
//    return localStorage.getItem("auth_token") || "";
//}

type Props = {
    initial: string  ;
    profileId?: number;
    onSaved?: (newUsername: string) => void;
    debounceMs?: number;  // default 300
    minLen?: number;      // default 3
    maxLen?: number;      // default 24
    pattern?: RegExp;     // default /^[a-z0-9](?:[a-z0-9-_]*[a-z0-9])?$/i
};

function normalizeBase(input: string) {
    // Keep alnum and - _ only, collapse spaces/punctuation to '-'
    
    const trimmed = input.trim();
    if (!trimmed) return "";
    return trimmed
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^[-_]+|[-_]+$/g, "");
}

function makeSuggestions(
    base: string,
    maxLen: number,
    count = 6
): string[] {
    if (!base) return [];
    const ideas = new Set<string>();

    const candidates = [
        base,
        `${base}1`,
        `${base}123`,
        `${base}_hq`,
        `${base}-app`,
        `${base}${new Date().getFullYear()}`,
        `the-${base}`,
        `${base}-official`,
        `${base}_dev`,
        `${base}-io`,
    ];

    // Pad with numeric suffixes if needed
    for (let i = 2; candidates.length < 20; i++) {
        candidates.push(`${base}${i}`);
    }

    for (const c of candidates) {
        let s = c.slice(0, maxLen);
        if (s.length === 0) continue;
        // ensure starts/ends alnum; if not, trim
        s = s.replace(/^[^a-z0-9]+/i, "").replace(/[^a-z0-9]+$/i, "");
        if (s) ideas.add(s);
        if (ideas.size >= count) break;
    }

    return Array.from(ideas).slice(0, count);
}

const UsernameEditorImpl: React.FC<Props> = ({
    initial ,
    profileId,
    onSaved,
    debounceMs = 300,
    minLen = 3,
    maxLen = 24,
    pattern = /^[a-z0-9](?:[a-z0-9-_]*[a-z0-9])?$/i,
}) => {
    
    const { token } = useAuth();
    console.log("UsernameEditor - UsernameEditorImpl - initial: " + initial + " & profileId: " + profileId)
    // Local, isolated state (won't affect parent)
    const [value, setValue] = useState<string>(initial);
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<UsernameCheckResult | null>(null);
    const [msg, setMsg] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [isPending, startTransition] = useTransition();

    // debounce machinery
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastRequestedRef = useRef<string>("");

    const base = useMemo(() => normalizeBase(value), [value]);
    const unchanged = value === initial;

    const localError = useMemo(() => {
        if (!base) return "Username is required";
        if (base.length < minLen) return `At least ${minLen} characters`;
        if (base.length > maxLen) return `At most ${maxLen} characters`;
        if (!pattern.test(base)) return "Use letters, numbers, dashes or underscores";
        return null;
    }, [base, minLen, maxLen, pattern]);

    const canSave = !!token && !unchanged && !localError && available?.ok && !saving && !isPending;

    const suggestions = useMemo(
        () => (!available?.ok ? makeSuggestions(base, maxLen) : []),
        [available?.ok, base, maxLen]
    );

    // --- Handlers are memoized to avoid prop identity churn ---
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setMsg(null);
        setAvailable(null);
        setValue(v);
    }, []);

    const pickSuggestion = useCallback((s: string) => {
        setMsg(null);
        setAvailable(null);
        setValue(s);
    }, []);

    const save = useCallback(async () => {
        if (!canSave) return;

        setSaving(true);
        setMsg(null);

        try {
            // 1) Re-check before saving (source of truth = backend)
            console.log("UsernameEditor - UsernameEditorImpl 2nd time check - initial: " + initial + " & profileId: " + profileId)
            const chk = await checkUsernameAvailability(base, profileId);
            setAvailable(chk);
            if (!chk.ok) {
                setMsg(chk.reason || "Username not available");
                return;
            }
            // 2) Save
            const res = await updateMyUsername(token, base);
            setAvailable(res);
            if (res.ok) {
                setMsg("Saved!");
                startTransition(() => onSaved?.(base));
            } else {
                setMsg(res.reason || "Save failed");
            }
        } catch (e: any) {
            setMsg(e?.message || "Request failed");
        } finally {
            setSaving(false);
        }
    }, [canSave, token, base, onSaved]);

    // --- Debounced availability check on each change (LinkedIn-like), parent-safe ---
    useEffect(() => {
        // Reset visual state
        setMsg(null);

        // No need to check when empty or unchanged
        if (!base || base === initial) {
            setChecking(false);
            setAvailable(null);
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        if (localError) {
            // Local validation fail: don't ping backend
            setChecking(false);
            setAvailable({ ok: false, reason: localError });
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        setChecking(true);

        const run = async () => {
            lastRequestedRef.current = base;
            try {
                console.log("UsernameEditor - UsernameEditorImpl 2nd time check - initial: " + initial + " & profileId: " + profileId)
                const res = await checkUsernameAvailability(base, profileId);
                // Only apply result if this is still the latest requested value
                if (lastRequestedRef.current === base) {
                    setAvailable(res);
                }
            } catch (e: any) {
                if (lastRequestedRef.current === base) {
                    setAvailable({ ok: false, reason: e?.message || "Check failed" });
                }
            } finally {
                if (lastRequestedRef.current === base) {
                    setChecking(false);
                }
            }
        };

        timerRef.current = setTimeout(run, debounceMs);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [base, initial, localError, debounceMs]);

    // --- UI ---
    const borderClass = available
        ? available.ok
            ? "border-green-500 focus:ring-green-500"
            : "border-red-500 focus:ring-red-500"
        : checking
            ? "border-amber-400 focus:ring-amber-400"
            : "border-gray-300 focus:ring-gray-300";

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">Username</label>

            <div className="flex items-center gap-2">
                <input
                    value={value}
                    onChange={onChange}
                    placeholder="your-handle"
                    className={`flex-1 rounded-xl border px-3 py-2 outline-none focus:ring ${borderClass}`}
                    aria-invalid={!!available && !available.ok}
                />
                <button
                    onClick={save}
                    disabled={!canSave}
                    className={`rounded-xl px-3 py-2 border text-sm ${canSave ? "hover:bg-gray-50" : "opacity-60 cursor-not-allowed"
                        }`}
                    title={!token ? "Sign in required" : ""}
                >
                    {saving ? "Saving…" : "Save"}
                </button>
            </div>

            <div className="text-xs">
                {!base && <span className="text-gray-500">Choose a unique handle.</span>}

                {checking && !!base && !localError && (
                    <span className="text-gray-500">Checking availability…</span>
                )}

                {available && !available.ok && (
                    <span className="text-red-600">
                        {available.reason || "Username is already taken"}
                    </span>
                )}

                {available?.ok && base !== initial && (
                    <span className="text-green-600">Great—this username is available.</span>
                )}

                {msg && (
                    <span className={`${available?.ok ? "text-green-600" : "text-red-600"} ml-1`}>
                        {msg}
                    </span>
                )}
            </div>

            {/* Suggestion chips (only when unavailable) */}
            {available && !available.ok && suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            onClick={() => pickSuggestion(s)}
                            className="text-xs rounded-full border px-3 py-1 hover:bg-gray-50"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Prevent parent re-renders from re-rendering this component unless props actually change
const UsernameEditor = React.memo(UsernameEditorImpl);
export default UsernameEditor;
