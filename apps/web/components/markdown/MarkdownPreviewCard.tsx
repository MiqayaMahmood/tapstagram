"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
    md?: string | null;
    maxChars?: number;   // quick truncate before render
    className?: string;
};

export default function MarkdownPreviewCard({ md, maxChars = 380, className }: Props) {
    const trimmed = (md || "").trim();
    const sliced = trimmed.length > maxChars ? trimmed.slice(0, maxChars) + "…" : trimmed;

    return (
        <div className={`rounded-xl border bg-white p-3 shadow-sm ${className || ""}`}>
            {trimmed ? (
                <div className="prose prose-sm max-w-none line-clamp-6">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {sliced}
                    </ReactMarkdown>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No description yet.</p>
            )}
        </div>
    );
}
