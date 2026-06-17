import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { MediaStorage, UploadResult } from "./types";

const MEDIA_DIR = path.join(process.cwd(), "media");
const PUBLIC_BASE = process.env.PUBLIC_BASE_URL || "";

if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });

export class LocalStorage implements MediaStorage {
    toPublicUrl(keyOrUrl: string) {
        if (!/^https?:\/\//i.test(keyOrUrl)) return `${PUBLIC_BASE}/media/${keyOrUrl}`;
        return keyOrUrl;
    }

    isManagedUrl(keyOrUrl: string) {
        if (!keyOrUrl) return false;
        if (!/^https?:\/\//i.test(keyOrUrl)) return true;
        return keyOrUrl.startsWith(`${PUBLIC_BASE}/media/`);
    }

    async upload({
        filename,
        mimetype,
        stream,
    }: {
        filename: string;
        mimetype: string;
        stream: NodeJS.ReadableStream;
    }): Promise<UploadResult> {
        const ext = filename.includes(".")
            ? filename.split(".").pop()
            : mimetype === "image/png"
                ? "png"
                : mimetype === "image/jpeg"
                    ? "jpg"
                    : "bin";

        const key = `${Date.now()}-${randomUUID()}.${ext}`;
        const abs = path.join(MEDIA_DIR, key);

        await new Promise<void>((resolve, reject) => {
            const ws = fs.createWriteStream(abs);
            stream.pipe(ws);
            ws.on("finish", () => resolve());
            ws.on("error", reject);
            stream.on("error", reject);
        });

        return { url: this.toPublicUrl(key), key };
    }

    async delete(keyOrUrl: string) {
        if (!this.isManagedUrl(keyOrUrl)) return;

        const key = keyOrUrl.replace(/^https?:\/\/[^/]+\/media\//i, "");
        const abs = path.join(MEDIA_DIR, key);
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
    }
}