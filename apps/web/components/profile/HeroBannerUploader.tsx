"use client";
import { useState } from "react";

export default function HeroBannerUploader({ initialUrl }: { initialUrl?: string }) {
    const [img, setImg] = useState(initialUrl);
    const [loading, setLoading] = useState(false);

    async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);

        const finalUrl = await yourUploadFlow(file); // <-- use your current uploader

        await fetch(`/api/profile/media`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "banner", url: finalUrl })
        });

        setImg(finalUrl);
        setLoading(false);
    }

    return (
        <div className="relative">
            <img
                src={img || "/default-hero.jpg"}
                alt="Hero"
                className="h-48 w-full object-cover rounded-2xl border"
            />
            <label className="absolute bottom-3 right-3 cursor-pointer bg-black/60 text-white text-xs px-3 py-1.5 rounded">
                {loading ? "Uploading..." : "Change banner"}
                <input type="file" accept="image/*" className="hidden" onChange={onPick} />
            </label>
        </div>
    );
}

async function yourUploadFlow(file: File): Promise<string> {
    // ... existing code in your project to get a public URL
    throw new Error("Implement yourUploadFlow(file) using your current uploader.");
}
