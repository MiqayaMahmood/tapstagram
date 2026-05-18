'use client';
import React from 'react';

function CopyBtn({ text }: { text: string }) {
    const copy = async () => { try { await navigator.clipboard.writeText(text); } catch { } };
    return <button onClick={copy} className="text-sm border rounded-xl border-zinc-400 px-4 py-1">Copy</button>;
}

export default function ProfileContact({ email, phone }: { email: string | null; phone: string | null }) {
    if (!email && !phone) {
        return <div className="border rounded-2xl p-4 bg-white text-sm text-gray-500">No contact info.</div>;
    }
    return (
        <div className="border rounded-xl border-zinc-400 p-4 bg-white">
            <div className="font-bold mb-2">Contact</div>
            <div className="space-y-2 text-lg">
                {email && (
                    <div className="flex items-center justify-between">
                        <span className="truncate">📧 {email}</span>
                        <CopyBtn text={email} />
                    </div>
                )}
                {phone && (
                    <div className="flex items-center justify-between">
                        <span className="truncate">📱 {phone}</span>
                        <CopyBtn text={phone} />
                    </div>
                )}
            </div>
        </div>
    );
}
