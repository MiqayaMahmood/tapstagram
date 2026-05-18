import { Bookmark, BookmarkCheck, Bell, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

type ProjectState = {
    bookmarked: boolean;
    following: boolean;
    bookmarkCount: number;
    followerCount: number;
};

const DEFAULT_STATE: ProjectState = {
    bookmarked: false,
    following: false,
    bookmarkCount: 0,
    followerCount: 0,
};

export function ProjectActions({ projectId }: { projectId: number }) {
    const { token } = useAuth();
    //const [state, setState] = useState<{ bookmarked: boolean; following: boolean; bookmarkCount: number; followerCount: number } | null>(null);
    const [state, setState] = useState<ProjectState>(DEFAULT_STATE);
    let cancelled = false;
    const [busy, setBusy] = useState<null | 'bookmark' | 'follow'>(null);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(`${API_BASE}/projects/${projectId}/state`, {
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                credentials: "include",
                cache: "no-store",
            });
                if (!r.ok) return; // keep defaults on failure
                const data = await r.json();
                if (cancelled) return;
                // Defensive normalization so we never render null/NaN
                setState((prev) => ({
                    bookmarked: Boolean(data.bookmarked ?? prev.bookmarked),
                    following: Boolean(data.following ?? prev.following),
                    bookmarkCount: Math.max(0, Number(data.bookmarkCount ?? prev.bookmarkCount)),
                    followerCount: Math.max(0, Number(data.followerCount ?? prev.followerCount)),
                }));
            } catch {
                // swallow errors; defaults remain visible
            }

        })();
        return () => {
            cancelled = true;
        };
    }, [projectId, token]);

    async function toggle(kind: 'bookmark' | 'follow') {
        if (busy) return; // prevent double taps while a request is in flight
        setBusy(kind);

        // Snapshot for rollback
        const prev = state;

        // Compute optimistic next state
        const next: ProjectState =
            kind === 'bookmark'
                ? {
                    ...state,
                    bookmarked: !state.bookmarked,
                    bookmarkCount: Math.max(0, state.bookmarkCount + (state.bookmarked ? -1 : 1)),
                }
                : {
                    ...state,
                    following: !state.following,
                    followerCount: Math.max(0, state.followerCount + (state.following ? -1 : 1)),
                };

        setState(next);

        const method = (kind === 'bookmark' ? state.bookmarked : state.following) ? 'DELETE' : 'POST';
        const url =
            kind === 'bookmark'
                ? `${API_BASE}/projects/${projectId}/bookmark`
                : `${API_BASE}/projects/${projectId}/follow`;

        try {
            const r = await fetch(url, {
                method,
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                credentials: 'include',
            });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            // success: keep optimistic state
        } catch {
            // rollback on error
            setState(prev);
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="flex flex-wrap px-4 py-4 gap-4" >
            
            <Button variant={state.bookmarked ? "default" : "outline"} onClick={() => toggle("bookmark")} disabled={busy === 'bookmark'}>
                {state.bookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                {state.bookmarked ? "Bookmarked" : "Bookmark"}
                <span className="ml-2 text-xs opacity-70">{state.bookmarkCount}</span>
            </Button>

            <Button variant={state.following ? "default" : "outline"} onClick={() => toggle("follow")} disabled={busy === 'follow'}>
                {state.following ? <BellRing className="h-4 w-4 mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                {state.following ? "Following" : "Follow"}
                <span className="ml-2 text-xs opacity-70">{state.followerCount}</span>
            </Button>
        </div>
    );
}
