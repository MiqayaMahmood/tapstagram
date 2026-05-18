// apps/web/src/services/files.ts
import { API_URL } from '@/lib/api';

export async function uploadFile(token: string, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_URL}/files/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json() as Promise<{ ok: boolean; url: string }>;
}
