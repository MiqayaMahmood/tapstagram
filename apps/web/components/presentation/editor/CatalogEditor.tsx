"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createId } from "./utils";
import ImageField from "@/components/presentation/editor/ImageField";

export  function CatalogEditor({
    block,
    onChange,
}: {
    block: any;
    onChange: (next: any) => void;
}) {
    const d = block.data || {};
    const items = d.items || [];

    function updateItem(id: string, patch: any) {
        onChange({
            ...block,
            data: {
                ...d,
                items: items.map((item: any) => (item.id === id ? { ...item, ...patch } : item)),
            },
        });
    }

    function addItem() {
        onChange({
            ...block,
            data: {
                ...d,
                items: [
                    ...items,
                    {
                        id: createId("catalog-item"),
                        title: "",
                        text: "",
                        imageUrl: "",
                        link: "",
                    },
                ],
            },
        });
    }

    function removeItem(id: string) {
        onChange({
            ...block,
            data: {
                ...d,
                items: items.filter((item: any) => item.id !== id),
            },
        });
    }

    return (
        <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Catalog</h2>

            <div className="grid gap-2">
                <Label>Section Title</Label>
                <Input
                    value={d.title || ""}
                    onChange={(e) => onChange({ ...block, data: { ...d, title: e.target.value } })}
                    className="h-11 rounded-2xl"
                />
            </div>

            <div className="space-y-4">
                {items.map((item: any, idx: number) => (
                    <div key={item.id} className="rounded-2xl border border-zinc-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-zinc-900">Item {idx + 1}</div>
                            <Button type="button" variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                                Remove
                            </Button>
                        </div>

                        <div className="grid gap-2">
                            <Label>Title</Label>
                            <Input
                                value={item.title || ""}
                                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                className="h-11 rounded-2xl"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <textarea
                                value={item.text || ""}
                                onChange={(e) => updateItem(item.id, { text: e.target.value })}
                                className="min-h-[90px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Image URL</Label>
                            <ImageField
                                label="Image"
                                value={item.imageUrl || ""}
                                onChange={(url) => updateItem(item.id, { imageUrl: url })}
                            />
                            <Input
                                value={item.imageUrl || ""}
                                onChange={(e) => updateItem(item.id, { imageUrl: e.target.value })}
                                className="h-11 rounded-2xl"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Link</Label>
                            <Input
                                value={item.link || ""}
                                onChange={(e) => updateItem(item.id, { link: e.target.value })}
                                className="h-11 rounded-2xl"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <Button type="button" onClick={addItem} className="rounded-2xl">
                Add Catalog Item
            </Button>
        </div>
    );
}