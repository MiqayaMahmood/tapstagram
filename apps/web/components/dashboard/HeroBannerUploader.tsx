// apps/web/src/components/dashboard/CoverUploader.tsx
'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { uploadFile } from '@/services/files';
import { updateCover } from '@/services/profile';
import { toast } from "sonner";

export default function CoverUploader({ url }: { url: string | null }) {
    const { token } = useAuth();
    
    const [preview, setPreview] = useState(url || '');
    const [loading, setLoading] = useState(false);

    const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f || !token) return;
        setLoading(true);
        try {
            const up = await uploadFile(token, f);
            await updateCover(token, up.url);
            setPreview(up.url);
            toast.success('Cover updated');
        } catch {
            toast.error('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-xl overflow-hidden bg-gray-50">
            <div className="relative h-40 w-full">
                {preview ? <Image src={preview} alt="Cover" fill className="object-cover" /> : null}
            </div>
            <div className="p-2">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 border rounded cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={onPick} disabled={loading} />
                    {loading ? 'Uploading…' : 'Change cover'}
                </label>
            </div>
        </div>
    );
}
