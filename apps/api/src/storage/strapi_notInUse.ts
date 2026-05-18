// src/storage/strapi.ts
import type { MediaStorage, UploadResult } from "./types";
// If you're on Node 18+ and using the global fetch, you can remove this import.
import fetch from "node-fetch";
import FormData from "form-data";

const STRAPI_URL = process.env.STRAPI_URL || "";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || "";
const STRAPI_PREFIX = process.env.STRAPI_UPLOAD_PREFIX || ""; // optional folder/path

if (!STRAPI_URL || !STRAPI_TOKEN) {
    // You can throw here or allow the factory to choose LocalStorage if missing
    // throw new Error("STRAPI_URL and STRAPI_TOKEN must be set");
}

interface StrapiFile {
    id: number;
    url: string;   // may be relative (e.g., /uploads/...)
    name: string;
    size: number;  // KB in Strapi (often bytes, but treat as number)
    mime: string;
    width?: number;
    height?: number;
    // ... other fields Strapi may return; keep the interface extensible if needed
}

export class StrapiStorage implements MediaStorage {
    toPublicUrl(keyOrUrl: string) {
        // Strapi returns absolute or relative URLs; normalize to absolute
        return keyOrUrl.startsWith("http") ? keyOrUrl : `${STRAPI_URL}${keyOrUrl}`;
    }

    async upload(opts: {
        filename: string;
        mimetype: string;
        stream: NodeJS.ReadableStream;
    }): Promise<UploadResult> {
        const { filename, mimetype, stream } = opts;

        // Prepare multipart form data
        const fd = new FormData();
        if (STRAPI_PREFIX) {
            // Depending on your Strapi storage provider, "path" or "folder" may be supported.
            // Upload plugin (v4) commonly supports "path".
            fd.append("path", STRAPI_PREFIX);
        }
        fd.append("files", stream as any, { filename, contentType: mimetype });

        // Send to Strapi Upload API
        const res = await fetch(`${STRAPI_URL}/api/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
            body: fd,
        });

        if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`Strapi upload failed: ${res.status} ${t || res.statusText}`);
        }

        // Strapi returns an array of uploaded files
        const files = (await res.json()) as StrapiFile[];
        const file = files?.[0];
        if (!file?.url) {
            throw new Error("Strapi upload succeeded but response did not include a file URL.");
        }

        const absoluteUrl = this.toPublicUrl(file.url);

        const result: UploadResult = {
            url: absoluteUrl,
            key: String(file.id), // keep the Strapi file id for optional deletes
            size: file.size,
            mime: file.mime,
            width: file.width,
            height: file.height,
        };

        return result;
    }

    // Optional: implement delete if you expose a secure deletion route in Strapi
    // async delete(keyOrUrl: string): Promise<void> {
    //   // If you store Strapi file IDs as "key", you can call your custom endpoint
    //   // e.g., await fetch(`${STRAPI_URL}/api/files/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }});
    // }
}



//import { Storage, UploadResult } from "./types";
//import fetch from "node-fetch"; // if not available globally
//import FormData from "form-data";

//const STRAPI_URL = process.env.STRAPI_URL!;            // e.g. https://cms.example.com
//const STRAPI_TOKEN = process.env.STRAPI_TOKEN!;          // a permanent token or service token
//const STRAPI_PREFIX = process.env.STRAPI_UPLOAD_PREFIX || ""; // optional folder/prefix

//export class StrapiStorage implements Storage {
//    toPublicUrl(keyOrUrl: string) {
//        // Strapi returns absolute URLs; just pass through
//        return keyOrUrl;
//    }

//    async upload({ filename, stream, mimetype }: { filename: string; mimetype: string; stream: NodeJS.ReadableStream }): Promise<UploadResult> {
//        const fd = new FormData();
//        // Strapi supports optional 'path' or 'folder' (depending on your provider)
//        if (STRAPI_PREFIX) fd.append("path", STRAPI_PREFIX);
//        fd.append("files", stream as any, { filename, contentType: mimetype });

//        const res = await fetch(`${STRAPI_URL}/api/upload`, {
//            method: "POST",
//            headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
//            body: fd as any,
//        });

//        if (!res.ok) {
//            const t = await res.text();
//            throw new Error(`Strapi upload failed: ${res.status} ${t}`);
//        }

//        const json: any[] = await res.json();
//        const file = json[0];
//        // Common fields: url, name, size, mime, width/height (if image)
//        return {
//            url: file.url.startsWith("http") ? file.url : `${STRAPI_URL}${file.url}`,
//            key: String(file.id),  // Strapi file id
//            size: file.size,
//            mime: file.mime,
//            width: file.width,
//            height: file.height,
//        };
//    }

//    async delete(keyOrUrl: string) {
//        // You can support deletes via Strapi Upload API (needs a custom endpoint or admin token)
//        // Example (if you expose a secure custom deletion endpoint):
//        // await fetch(`${STRAPI_URL}/api/files/${key}`, { method: 'DELETE', headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }});
//    }
//}
