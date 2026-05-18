"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/services/uploads";
import { useAuth } from "@/context/AuthContext";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function ImageField({
    label,
    value,
    onChange,
}: {
    label: string;
    value?: string;
    onChange: (url: string) => void;
}) {
    const { token } = useAuth();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [busy, setBusy] = useState(false);

    async function onPickFile(file: File | null) {
        if (!file) return;
        try {
            setBusy(true);
            const res = await uploadImage(file, token || undefined);
            onChange(res.url);
            toast.success("Image uploaded");
        } catch (e: any) {
            toast.error(e?.message || "Upload failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>

            {value ? (
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                    <div className="h-40 w-full bg-zinc-100">
                        <img src={value} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex items-center gap-2 p-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl"
                            onClick={() => fileRef.current?.click()}
                            disabled={busy}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {busy ? "Uploading..." : "Replace"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl"
                            onClick={() => onChange("")}
                            disabled={busy}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl"
                            onClick={() => fileRef.current?.click()}
                            disabled={busy}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {busy ? "Uploading..." : "Upload image"}
                        </Button>
                    </div>
                </div>
            )}

            <Input
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 rounded-2xl"
                placeholder="https://..."
            />

            <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] || null)}
            />
        </div>
    );
}