// apps/web/src/components/dashboard/AvatarUploader.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { uploadFile } from '@/services/files';
import { updateAvatar } from '@/services/profile';
import { toast } from "sonner";

export default function AvatarUploader({ url }: { url: string | null }) {
    const { token } = useAuth();

    const [preview, setPreview] = useState(url || '');
    const [loading, setLoading] = useState(false);

    const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f || !token) return;
        setLoading(true);
        try {
            const up = await uploadFile(token, f);
            await updateAvatar(token, up.url);
            setPreview(up.url);
            toast.success('Avatar updated');
        } catch {
            toast.error('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                {preview ? <Image src={preview} alt="Avatar" fill className="object-cover" /> : null}
            </div>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 border rounded cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={onPick} disabled={loading} />
                {loading ? 'Uploading…' : 'Change'}
            </label>
        </div>
    );
}
