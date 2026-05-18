// apps/web/src/components/dashboard/ProfileBasics.tsx
'use client';
import { useState } from 'react';
//import { useToast } from '@/components/ui/ToastHost';
import { upsertMyProfile } from '@/services/profile';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
export default function ProfileBasics({ initial }: {
    initial: { name: string | null; title: string | null; bio: string | null; location: string | null; email: string | null; phone: string | null; }
}) {
    const { token } = useAuth();
    //const { push } = useToast();
    const [form, setForm] = useState({ ...initial });
    const [saving, setSaving] = useState(false);

    const save = async () => {
        if (!token) return;
        setSaving(true);
        try {
            await upsertMyProfile(token, form);
            toast.success('Saved');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="border rounded-xl border-zinc-400 bg-white p-4 space-y-3">
            <div className="font-semibold">Profile basics</div>
            {(['name', 'title', 'location', 'email', 'phone'] as const).map((k) => (
                <input
                    key={k}
                    className="w-full border rounded p-2 text-sm"
                    placeholder={k[0].toUpperCase() + k.slice(1)}
                    value={(form as any)[k] ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                />
            ))}
            <textarea
                className="w-full border rounded p-2 text-sm h-28"
                placeholder="Bio"
                value={form.bio ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
            <button
                onClick={save}
                disabled={saving}
                className={`px-4 py-2 rounded bg-blue-600 text-white ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
                {saving ? 'Saving…' : 'Save'}
            </button>
        </div>
    );
}
