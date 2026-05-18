"use client";
import { useEffect, useState } from "react";
import { searchProfiles } from "../../../services/profile";
import Image from "next/image";
import Link from "next/link";
import UsernameEditor from "@/components/profile/UsernameEditor";
import ProfileAvatarUploader from "@/components/profile/ProfileAvatarUploader";
import HeroBannerUploader from "@/components/profile/HeroBannerUploader";

export default function ProfilesDirectoryPage() {
    const [q, setQ] = useState("");
    const [location, setLocation] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    async function load(page = 1) {
        setLoading(true);
        const res = await searchProfiles({ q, location, page, pageSize: 24 });
        setItems(res.items);
        setTotal(res.total);
        setLoading(false);
    }

    useEffect(() => { load(1); /* initial */ }, []);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-lg font-semibold">Profiles</h1>

            <div className="flex gap-2">
                <input className="border p-2 rounded flex-1" placeholder="Search name, title, username…" value={q} onChange={e => setQ(e.target.value)} />
                <input className="border p-2 rounded w-56" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 rounded" onClick={() => load(1)}>Search</button>
            </div>

            {loading ? <div>Loading…</div> :
                items.length === 0 ? <div className="text-sm text-gray-600">No profiles found.</div> :
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(p => (
                            <li key={p.id} className="border rounded p-3 bg-white flex gap-3">
                                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                    {p.profile_picture_url ? (
                                        <Image src={p.profile_picture_url} alt={p.name} fill className="object-cover" />
                                    ) : <div className="w-full h-full flex items-center justify-center text-gray-400">{p.name?.[0] ?? "?"}</div>}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium truncate">{p.name}</div>
                                    <div className="text-sm text-gray-600 truncate">{p.title}</div>
                                    <div className="text-xs text-gray-500 truncate">{p.location}</div>
                                    {p.username && (
                                        <Link className="text-blue-600 text-sm underline" href={`/@${p.username}`}>View profile</Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
            }
            <div className="space-y-6">
                {items.map(p => (
                    <div className="-mt-14 ml-6">
                       <HeroBannerUploader initialUrl={p.hero_banner_url} />
                        <div className="-mt-14 ml-6">
                            <ProfileAvatarUploader initialUrl={p.profile_picture_url} />
                        </div>
                        <UsernameEditor initial={p.username} /> 
                    </div>
                ))}
            </div>
        </div>
    );
}
