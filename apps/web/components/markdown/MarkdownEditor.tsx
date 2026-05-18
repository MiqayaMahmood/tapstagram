"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { uploadImage } from "@/lib/upload-image";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = {
    value?: string | null;
    onChange: (val: string) => void;
    height?: number;
};

export default function MarkdownEditor({ value, onChange, height = 320 }: Props) {
    // Insert helper
    const insertAtCursor = useCallback((text: string) => {
        // MDEditor exposes `commands` prop to customize, but simplest is to append or replace selection.
        // Here we just append; for full cursor control you can switch to textarea ref logic.
        onChange((value ?? "") + (value?.endsWith("\n") ? "" : "\n") + text + "\n");
    }, [onChange, value]);

    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        if (!e.dataTransfer?.files?.length) return;
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file.type.startsWith("image/")) return;

        try {
            const { url } = await uploadImage(file);
            const safeName = file.name.replace(/\s+/g, "-");
            insertAtCursor(`![${safeName}](${url})`);
        } catch (err) {
            console.error(err);
            alert("Image upload failed. Please try again.");
        }
    }, [insertAtCursor]);

    const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const it of items) {
            if (it.kind === "file") {
                const file = it.getAsFile();
                if (file && file.type.startsWith("image/")) {
                    e.preventDefault();
                    try {
                        const { url } = await uploadImage(file);
                        const safeName = file.name.replace(/\s+/g, "-");
                        insertAtCursor(`![${safeName}](${url})`);
                    } catch (err) {
                        console.error(err);
                        alert("Image upload failed. Please try again.");
                    }
                    return;
                }
            } else if (it.kind === "string") {
                const text = await new Promise<string>(res => it.getAsString(res));
                // If a URL is pasted, insert as image syntax if it looks like an image
                if (/^https?:\/\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(text.trim())) {
                    e.preventDefault();
                    insertAtCursor(`![image](${text.trim()})`);
                    return;
                }
            }
        }
    }, [insertAtCursor]);

    return (
        <div
            data-color-mode="light"
            className="rounded-2xl border overflow-hidden"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onPaste={handlePaste}
        >
            <MDEditor
                value={value ?? ""}
                onChange={(val) => onChange(val ?? "")}
                height={height}
                preview="edit"          // change to "live" for side-by-side
                visiableDragbar={false}
            />
            <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-gray-50">
                Tip: drag & drop an image, paste an image, or paste an image URL to insert <code>![alt](url)</code>.
            </div>
        </div>
    );
}
