'use client';

import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';
import { toast } from 'sonner';
import NextImage from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
    initialUrl?: string;
    onChanged?: (url: string) => void; // optional callback to lift state to the parent (e.g., setMe)
    initMode?: string;
    entityId?: number;
};

// Simple in-browser compositor that renders the chosen image into a 3:1 canvas with
// adjustable scale (zoom) and position (drag). Then we upload the rendered Blob.
export default function HeroBannerCropper({ initialUrl, onChanged, initMode, entityId }: Props) {
    const { token } = useAuth();
    const [src, setSrc] = useState<string | undefined>(initialUrl);
    const [mode, setMode] = useState<string | "profile">(initMode);
    const [passedId, setPassedId] = useState<number | 0>(entityId);
    const [busy, setBusy] = useState(false);
    const [editing, setEditing] = useState(false);
    const frameRef = useRef<HTMLDivElement>(null);

    // For editing: the raw local file preview (object URL) before upload
    const [editSrc, setEditSrc] = useState<string | null>(null);
    const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

    // Transform state
    const [scale, setScale] = useState<number>(1);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Drag helpers
    const dragRef = useRef<{ dragging: boolean; x: number; y: number } | null>(null);

    // Banner target size (you can tweak)
    const BANNER_W = 1500;
    const BANNER_H = 500;

    // When a new file is chosen, open editor
    async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0] || !token) return;
        const file = e.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        setEditSrc(objectUrl);
        setEditing(true);
        setScale(1);
        setOffset({ x: 0, y: 0 });
    }

    // Measure image natural size for correct scaling math
    useEffect(() => {
        if (!editSrc) return;
        const img = new  window.Image()
        img.src = editSrc;
        img.onload = () => {setNatural({ w: img.naturalWidth, h: img.naturalHeight });
        };
    }, [editSrc]);

    // Compose the banner into a canvas Blob (JPEG)
    async function renderBannerBlob_old(): Promise<Blob> {
        if (!editSrc || !natural) throw new Error('No image selected');

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = BANNER_W;
        canvas.height = BANNER_H;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, BANNER_W, BANNER_H);

        // Compute scaled image size within banner
        // Start by scaling image so its smaller side fits banner height (for a nice baseline),
        // then apply user scale factor; position is controlled by offset (drag).
        const baseScale = Math.max(BANNER_W / natural.w, BANNER_H / natural.h);
        const finalScale = baseScale * scale;

        const drawW = natural.w * finalScale;
        const drawH = natural.h * finalScale;

        // Center image, then offset
        const cx = (BANNER_W - drawW) / 2 + offset.x;
        const cy = (BANNER_H - drawH) / 2 + offset.y;

        // Draw
        const img = document.createElement('img');
        img.src = editSrc;
        await new Promise<void>((res) => (img.onload = () => res()));
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, cx, cy, drawW, drawH);

        // Export JPEG ~0.9 quality
        return await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9)
        );
    }

    async function renderBannerBlob_2(): Promise<Blob> {
        if (!editSrc || !natural) throw new Error("No image selected");

        const canvas = document.createElement("canvas");
        canvas.width = BANNER_W;
        canvas.height = BANNER_H;

        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, BANNER_W, BANNER_H);

        const img = document.createElement("img");
        img.src = editSrc;
        await new Promise<void>((res) => (img.onload = () => res()));

        // === MATCH CSS OBJECT-FIT: CONTAIN ===
        const scaleX = BANNER_W / natural.w;
        const scaleY = BANNER_H / natural.h;
        const baseScale = Math.min(scaleX, scaleY);

        // === MATCH CSS TRANSFORM ===
        const finalScale = baseScale * scale;

        const drawW = natural.w * finalScale;
        const drawH = natural.h * finalScale;

        const centerX = BANNER_W / 2;
        const centerY = BANNER_H / 2;

        ctx.save();

        // Move to center of canvas
        ctx.translate(centerX, centerY);

        // Apply user transform
        ctx.translate(offset.x, offset.y);
        ctx.scale(finalScale, finalScale);

        // Draw image centered (CSS transform-origin: center)
        ctx.drawImage(
            img,
            -natural.w / 2,
            -natural.h / 2,
            natural.w,
            natural.h
        );

        ctx.restore();

        return new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9)
        );
    }

    async function renderBannerBlob_3(): Promise<Blob> {
        if (!editSrc || !natural) throw new Error("No image selected");

        const canvas = document.createElement("canvas");
        canvas.width = BANNER_W;
        canvas.height = BANNER_H;

        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, BANNER_W, BANNER_H);

        const img = document.createElement("img");
        img.src = editSrc;
        await new Promise<void>((res) => (img.onload = () => res()));

        // === MATCH object-fit: contain ===
        const scaleX = BANNER_W / natural.w;
        const scaleY = BANNER_H / natural.h;
        const baseScale = Math.min(scaleX, scaleY);

        const finalScale = baseScale * scale;

        ctx.save();

        // 1️⃣ Move origin to canvas center
        ctx.translate(BANNER_W / 2, BANNER_H / 2);

        // 2️⃣ Apply CSS-style scaling
        ctx.scale(finalScale, finalScale);

        // 3️⃣ Apply offset in *scaled space*
        ctx.translate(offset.x / finalScale, offset.y / finalScale);

        // 4️⃣ Draw image centered (transform-origin: center)
        ctx.drawImage(
            img,
            -natural.w / 2,
            -natural.h / 2,
            natural.w,
            natural.h
        );

        ctx.restore();

        return new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9)
        );
    }

    async function renderBannerBlob(): Promise<Blob> {
        if (!editSrc || !natural) throw new Error("No image selected");
        if (!frameRef.current) throw new Error("Frame not ready");

        const frameRect = frameRef.current.getBoundingClientRect();

        // Preview frame dimensions (DOM pixels)
        const frameW = frameRect.width;
        const frameH = frameRect.height;

        if (frameW <= 0 || frameH <= 0) throw new Error("Invalid frame size");

        // Convert preview offsets (DOM px) → canvas px
        const ox = offset.x * (BANNER_W / frameW);
        const oy = offset.y * (BANNER_H / frameH);

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = BANNER_W;
        canvas.height = BANNER_H;

        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, BANNER_W, BANNER_H);

        // Load image
        const img = document.createElement("img");
        img.src = editSrc;
        await new Promise<void>((res, rej) => {
            img.onload = () => res();
            img.onerror = () => rej(new Error("Image failed to load"));
        });

        // === Match CSS object-fit: contain ===
        // baseScale scales the image to "contain" inside the banner
        const baseScale = Math.min(BANNER_W / natural.w, BANNER_H / natural.h);

        // === Match CSS transform: translate(px,px) scale(s) ===
        // In CSS, translate is applied BEFORE scale; translate values are therefore scaled.
        // Equivalent canvas approach: apply scale first, then translate in scaled units.
        const finalScale = baseScale * Math.max(0.2, scale);

        ctx.save();

        // Move origin to banner center
        ctx.translate(BANNER_W / 2, BANNER_H / 2);

        // Apply scaling
        ctx.scale(finalScale, finalScale);

        // Apply translation converted into "image space"
        // Because we've scaled the context, we divide by finalScale to keep translation in pixels.
        ctx.translate(ox / finalScale, oy / finalScale);

        // Draw image centered (transform-origin center)
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, -natural.w / 2, -natural.h / 2, natural.w, natural.h);

        ctx.restore();

        return await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9);
        });
    }


    async function save() {
        if (!token) return;
        setBusy(true);
        try {
            const blob = await renderBannerBlob();
            const fd = new FormData();
            fd.append('file', blob, 'banner.jpg');

            // 1) Upload (adapter decides: local or Strapi)
            const up = await fetch(`${API_URL}/uploads`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            }).then((r) => r.json());

            if (!up.ok || !up.url) throw new Error('Upload failed');

            // 2) Persist to profile
            let path = `${API_URL}/profiles/me/hero-banner`
            if (mode == "project")
                path = `${API_URL}/projects/${passedId}/updateHeroBanner`

            const res = await fetch(path, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: up.url }),
            }).then((r) => r.json());
            
            
            if (!res.ok) throw new Error('Save failed');
            
            
            setSrc(up.url);
            setEditing(false);
            setEditSrc(null);
            toast.success('Banner updated');
            
            onChanged?.(up.url);
        } catch (e: any) {
            toast.error(e.message || 'Banner update failed');
        } finally {
            setBusy(false);
        }
    }

    function cancelEdit() {
        if (editSrc) URL.revokeObjectURL(editSrc);
        setEditSrc(null);
        setEditing(false);
    }

    // Drag handlers for positioning the image inside the banner frame
    function onMouseDown(e: React.MouseEvent) {
        if (!editing) return;
        dragRef.current = { dragging: true, x: e.clientX - offset.x, y: e.clientY - offset.y };
    }
    function onMouseMove(e: React.MouseEvent) {
        if (!editing || !dragRef.current?.dragging) return;
        setOffset({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
    }
    function onMouseUp() {
        if (!editing) return;
        if (dragRef.current) dragRef.current.dragging = false;
    }

    const previewUrl = useMemo(() => (editing && editSrc ? editSrc : src), [editing, editSrc, src]);

    return (
        <div className="space-y-3">
            {/* Banner preview / editor */}
            <div
                className="relative w-full rounded-2xl overflow-hidden border bg-neutral-100"
                style={{ aspectRatio: '3 / 1' }} // 3:1
                ref={frameRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseUp}
                onMouseUp={onMouseUp}
            >
                {previewUrl ? (
                    <NextImage
                        src={previewUrl}
                        alt="Hero banner"
                        fill
                        className="select-none"
                        draggable={false}
                        style={editing
                            ? { objectFit: 'contain', transform: `translate(${offset.x}px, ${offset.y}px) scale(${Math.max(0.2, scale)})`, transformOrigin: 'center center' }
                            : { objectFit: 'cover' }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">No banner</div>
                )}

                <div className="absolute bottom-2 right-2 flex gap-2">
                    {!editing ? (
                        <>
                            <label className="bg-black/70 text-white text-xs px-2 py-1 rounded cursor-pointer">
                                Change banner
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePick}
                                />
                            </label>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={cancelEdit}
                                className="bg-white/80 text-sm px-2 py-1 rounded border"
                                disabled={busy}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={save}
                                className="bg-black text-white text-sm px-3 py-1 rounded disabled:opacity-60"
                                disabled={busy}
                            >
                                {busy ? 'Saving…' : 'Save'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Editing controls */}
            {editing && (
                <div className="flex items-center gap-3">
                    <label className="text-sm text-neutral-700">Zoom</label>
                    <input
                        type="range"
                        min={0.5}
                        max={3}
                        step={0.01}
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                    />
                    <span className="text-xs text-neutral-600">{scale.toFixed(2)}×</span>
                    <span className="text-xs text-neutral-500 ml-auto">Tip: drag image to reposition</span>
                </div>
            )}
        </div>
    );
}
