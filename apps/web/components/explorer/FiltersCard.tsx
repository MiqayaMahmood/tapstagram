'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TagsInput from './TagsInput';

const INDUSTRIES = [
    '', 'Software', 'Design', 'Marketing', 'Finance', 'Education', 'Healthcare', 'Retail', 'Real Estate', 'Other'
    , 'eCommerce', 'Hotel & Restaurants', 'Food & Drinks', 'Industrial & Machinary', 'Electrical & Electronics', 'Manufacturing', 'Distributions'
    , 'Import & Export', 'Services'
];

export default function FiltersCard() {
    const router = useRouter();
    const sp = useSearchParams();

    // derive initial state from URL
    const initial = useMemo(() => {
        const tags = (sp.get('tags') || '')
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
        return {
            q: sp.get('q') || '',
            name: sp.get('name') || '',
            title: sp.get('title') || '',
            location: sp.get('location') || '',
            industry: sp.get('industry') || '',
            tags,
            pageSize: Number(sp.get('pageSize') || 12),
        };
    }, [sp]);

    const [q, setQ] = useState(initial.q);
    const [name, setName] = useState(initial.name);
    const [title, setTitle] = useState(initial.title);
    const [location, setLocation] = useState(initial.location);
    const [industry, setIndustry] = useState(initial.industry);
    const [tags, setTags] = useState<string[]>(initial.tags);
    const [pageSize, setPageSize] = useState<number>(initial.pageSize);

    // keep local state in sync when URL changes externally
    useEffect(() => {
        setQ(initial.q);
        setName(initial.name);
        setTitle(initial.title);
        setLocation(initial.location);
        setIndustry(initial.industry);
        setTags(initial.tags);
        setPageSize(initial.pageSize);
    }, [initial]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const qs = new URLSearchParams();
        if (q) qs.set('q', q);
        if (name) qs.set('name', name);
        if (title) qs.set('title', title);
        if (location) qs.set('location', location);
        if (industry) qs.set('industry', industry);
        if (tags.length) qs.set('tags', tags.join(','));
        if (pageSize) qs.set('pageSize', String(pageSize));
        // always reset to first page on new search
        qs.set('page', '1');
        router.push(`/explore?${qs.toString()}`);
    };

    const reset = () => {
        router.push('/explore');
    };

    return (
        <form onSubmit={submit} className="border rounded-xl border-zinc-400 p-4 bg-white space-y-3">
            <div className="font-medium">Filters</div>

            <input
                className="w-full border rounded p-2 text-sm"
                placeholder="Search all (name, title, bio, location)"
                value={q}
                onChange={e => setQ(e.target.value)}
            />

            <input
                className="w-full border rounded p-2 text-sm"
                placeholder="Exact name filter"
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <input
                className="w-full border rounded p-2 text-sm"
                placeholder="Title contains"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <input
                className="w-full border rounded p-2 text-sm"
                placeholder="City, country…"
                value={location}
                onChange={e => setLocation(e.target.value)}
            />

            <div className="text-xs text-gray-600">Industry</div>
            <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full border rounded p-2 text-sm"
            >
                {INDUSTRIES.map(opt => (
                    <option key={opt} value={opt}>{opt || 'Any'}</option>
                ))}
            </select>

            <div className="text-xs text-gray-600">Tags</div>
            <TagsInput value={tags} onChange={setTags} />

            <div className="text-xs text-gray-600">Page size</div>
            <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                className="w-full border rounded p-2 text-sm"
            >
                {[6, 12, 18, 24, 30, 36].map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <div className="flex gap-2 pt-2">
                <button className="flex-1 rounded bg-blue-600 text-white text-sm py-2">Search</button>
                <button type="button" onClick={reset} className="flex-1 rounded border text-sm py-2">Reset</button>
            </div>
        </form>
    );
}
