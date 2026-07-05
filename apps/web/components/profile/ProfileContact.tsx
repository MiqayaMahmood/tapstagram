'use client';
import React from 'react';

function CopyBtn({ text }: { text: string }) {
    const copy = async () => { try { await navigator.clipboard.writeText(text); } catch { } };
    return <button onClick={copy} className="h-9 rounded-xl border border-blue-100 px-3 text-sm font-medium">Copy</button>;
}

export default function ProfileContact({ email, phone }: { email: string | null; phone: string | null }) {
    if (!email && !phone) {
        return <div className="rounded-2xl border border-blue-100 bg-white p-4 text-sm text-gray-500">No contact info.</div>;
    }
    return (
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-white p-4">
            <div className="font-bold mb-2">Contact</div>
            <div className="space-y-2 text-sm md:text-base">
                {email && (
                    <div className="flex min-w-0 items-center justify-between gap-2">
                        <span className="truncate">📧 {email}</span>
                        <CopyBtn text={email} />
                    </div>
                )}
                {phone && (
                    <div className="flex min-w-0 items-center justify-between gap-2">
                        <span className="truncate">📱 {phone}</span>
                        <CopyBtn text={phone} />
                    </div>
                )}
            </div>
        </div>
    );
}
