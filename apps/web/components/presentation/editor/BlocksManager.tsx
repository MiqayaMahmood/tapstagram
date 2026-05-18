"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { moveItem } from "./utils";

export default function BlocksManager({
    blocks,
    onChange,
}: {
    blocks: any[];
    onChange: (next: any[]) => void;
}) {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Blocks</h2>

            {blocks.map((block, index) => (
                <div
                    key={block.id}
                    className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                >
                    <div>
                        <div className="text-sm font-semibold text-zinc-900">{block.type}</div>
                        <div className="text-xs text-zinc-500">{block.id}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={index === 0}
                            onClick={() => onChange(moveItem(blocks, index, index - 1))}
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={index === blocks.length - 1}
                            onClick={() => onChange(moveItem(blocks, index, index + 1))}
                        >
                            <ArrowDown className="h-4 w-4" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onChange(blocks.filter((b) => b.id !== block.id))}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}