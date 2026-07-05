'use client';
import React, { useState } from 'react';

export default function ProfileAbout({ bio }: { bio: string | null }) {
    if (!bio) {
        return <div className="rounded-2xl border border-blue-100 bg-white p-4 text-sm text-gray-500">No bio yet.</div>;
    }

    const [open, setOpen] = useState(false);
    const short = bio.length > 280 ? bio.slice(0, 280) + '…' : bio;

    return (
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-white p-4">
            <div className="font-bold mb-2">About</div>
            <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-900 md:text-base">
                {open ? bio : short}
            </p>
            {bio.length > 280 && (
                <button
                    className="mt-2 text-sm font-medium underline"
                    onClick={() => setOpen(!open)}
                >
                    {open ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
}
