'use client';
import React, { useState } from 'react';

export default function TagsInput({
    value,
    onChange,
    placeholder = 'Add tag and press Enter',
}: {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}) {
    const [draft, setDraft] = useState('');

    const add = (t: string) => {
        const tag = t.trim();
        if (!tag) return;
        if (value.includes(tag)) return;
        onChange([...value, tag]);
        setDraft('');
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);
        } else if (e.key === 'Backspace' && !draft && value.length) {
            e.preventDefault();
            onChange(value.slice(0, -1));
        }
    };

    const remove = (t: string) => onChange(value.filter(x => x !== t));

    return (
        <div className="w-full border rounded p-2">
            <div className="flex flex-wrap gap-2">
                {value.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-xs">
                        {t}
                        <button type="button" onClick={() => remove(t)} className="opacity-70 hover:opacity-100">×</button>
                    </span>
                ))}
                <input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className="flex-1 min-w-[120px] outline-none text-sm"
                />
            </div>
        </div>
    );
}
