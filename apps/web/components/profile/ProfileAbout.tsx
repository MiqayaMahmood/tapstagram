'use client';
import React, { useState } from 'react';

export default function ProfileAbout({ bio }: { bio: string | null }) {
    if (!bio) {
        return <div className="border rounded-2xl p-4 bg-white text-sm text-gray-500">No bio yet.</div>;
    }

    const [open, setOpen] = useState(false);
    const short = bio.length > 280 ? bio.slice(0, 280) + '…' : bio;

    return (
        <div className="border rounded-xl border-zinc-400 p-4 bg-white">
            <div className="font-bold mb-2">About</div>
            <p className="text-lg text-gray-900 whitespace-pre-line">
                {open ? bio : short}
            </p>
            {bio.length > 280 && (
                <button
                    className="mt-2 text-md underline"
                    onClick={() => setOpen(!open)}
                >
                    {open ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
}
