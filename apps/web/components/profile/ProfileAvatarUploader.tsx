'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';
import { toast } from 'sonner';

export default function ProfileAvatarUploader({ initialUrl }: { initialUrl?: string }) {
    const { token } = useAuth();
    const [url, setUrl] = useState<string | undefined>(initialUrl);
    const [busy, setBusy] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setBusy(true);
        try {
            // 1) upload file
            const fd = new FormData();
            fd.append('file', file);
            const up = await fetch(`${API_URL}/uploads`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            }).then(r => r.json());

            if (!up.ok) throw new Error('Upload failed');

            // 2) save to profile
            const res = await fetch(`${API_URL}/profiles/me/avatar`, {
                method: 'PATCH',
                headers: {Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: up.url }),
            }).then(r => r.json());

            if (!res.ok) throw new Error('Save failed');

            setUrl(up.url);

            toast.success('Avatar updated');
        }
        catch (err: any) {
            toast.error(err.message || 'Avatar update failed');
        }
        finally {
            setBusy(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    }

    return (
        <div className="relative w-28 h-28 rounded-full overflow-hidden border bg-white">
            {url ? (
                <Image src={url} alt="Avatar" fill className="object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">No avatar</div>
            )}
            <label className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded cursor-pointer">
                {busy ? 'Uploading…' : 'Change'}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} disabled={busy} />
            </label>
        </div>
    );
}
