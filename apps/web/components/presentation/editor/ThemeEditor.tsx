"use client";

import { Label } from "@/components/ui/label";
import ColorField from "@/components/presentation/editor/ColorField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

export default function ThemeEditor({
    theme,
    onChange,
}: {
    theme: any;
    onChange: (next: any) => void;
}) {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Theme</h2>

            <div className="grid gap-2">
                <Label>Font Family</Label>
                <Select
                    value={theme?.fontFamily || "inter"}
                    onValueChange={(v) => onChange({ ...theme, fontFamily: v })}
                >
                    <SelectTrigger className="h-11 rounded-2xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Heading Size</Label>
                <Select
                    value={theme?.headingSize || "lg"}
                    onValueChange={(v) => onChange({ ...theme, headingSize: v })}
                >
                    <SelectTrigger className="h-11 rounded-2xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Radius</Label>
                <Select
                    value={theme?.radius || "2xl"}
                    onValueChange={(v) => onChange({ ...theme, radius: v })}
                >
                    <SelectTrigger className="h-11 rounded-2xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="md">MD</SelectItem>
                        <SelectItem value="lg">LG</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                        <SelectItem value="2xl">2XL</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Max Width</Label>
                <Select
                    value={theme?.maxWidth || "6xl"}
                    onValueChange={(v) => onChange({ ...theme, maxWidth: v })}
                >
                    <SelectTrigger className="h-11 rounded-2xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="4xl">4XL</SelectItem>
                        <SelectItem value="5xl">5XL</SelectItem>
                        <SelectItem value="6xl">6XL</SelectItem>
                        <SelectItem value="7xl">7XL</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Background Color</Label>
                <ColorField
                    label="Background Color"
                    value={theme?.bgColor || "#ffffff"}
                    onChange={(v) => onChange({ ...theme, bgColor: v })}
                />
            </div>

            <div className="grid gap-2">
                <Label>Text Color</Label>
                <ColorField
                    label="Text Color"
                    value={theme?.textColor || "#18181b"}
                    onChange={(v) => onChange({ ...theme, textColor: v })}
                />
            </div>

            <div className="grid gap-2">
                <Label>Accent Color</Label>
                <ColorField
                    label="Accent Color"
                    value={theme?.accentColor || "#3f3f46"}
                    onChange={(v) => onChange({ ...theme, accentColor: v })}
                />
            </div>
        </div>
    );
}