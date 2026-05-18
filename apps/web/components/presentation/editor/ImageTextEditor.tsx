"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageField from "@/components/presentation/editor/ImageField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

export default function ImageTextEditor({
    block,
    onChange,
}: {
    block: any;
    onChange: (next: any) => void;
}) {
    const d = block.data || {};

    return (
        <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Image + Text Block</h2>

            <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                    value={d.title || ""}
                    onChange={(e) => onChange({ ...block, data: { ...d, title: e.target.value } })}
                    className="h-11 rounded-2xl"
                />
            </div>

            <div className="grid gap-2">
                <Label>Text</Label>
                <textarea
                    value={d.text || ""}
                    onChange={(e) => onChange({ ...block, data: { ...d, text: e.target.value } })}
                    className="min-h-[120px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                />
            </div>

            <div className="grid gap-2">
                <Label>Image URL</Label>
                <ImageField
                    label="Image"
                    value={d.imageUrl || ""}
                    onChange={(url) => onChange({ ...block, data: { ...d, imageUrl: url } })}
                />
                <Input
                    value={d.imageUrl || ""}
                    onChange={(e) => onChange({ ...block, data: { ...d, imageUrl: e.target.value } })}
                    className="h-11 rounded-2xl"
                />
            </div>

            <div className="grid gap-2">
                <Label>Image Side</Label>
                <Select
                    value={d.imageSide || "left"}
                    onValueChange={(v) => onChange({ ...block, data: { ...d, imageSide: v } })}
                >
                    <SelectTrigger className="h-11 rounded-2xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>CTA Text</Label>
                <Input
                    value={d.ctaText || ""}
                    onChange={(e) => onChange({ ...block, data: { ...d, ctaText: e.target.value } })}
                    className="h-11 rounded-2xl"
                />
            </div>

            <div className="grid gap-2">
                <Label>CTA Link</Label>
                <Input
                    value={d.ctaLink || ""}
                    onChange={(e) => onChange({ ...block, data: { ...d, ctaLink: e.target.value } })}
                    className="h-11 rounded-2xl"
                />
            </div>
        </div>
    );
}