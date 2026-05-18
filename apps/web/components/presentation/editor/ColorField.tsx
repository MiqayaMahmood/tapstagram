"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ColorField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value || "#ffffff"}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 w-14 rounded-xl border border-zinc-200 bg-white p-1"
                />
                <Input
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 rounded-2xl"
                    placeholder="#ffffff"
                />
            </div>
        </div>
    );
}