import type { FastifyInstance } from "fastify";
import type { MediaStorage } from "../storage/types";

type FastifyWithStorage = FastifyInstance & {
    storage: MediaStorage;
};

export async function replaceManagedMedia(args: {
    app: FastifyWithStorage;
    oldUrl?: string | null;
    filename: string;
    mimetype: string;
    stream: NodeJS.ReadableStream;
    updateDb: (newUrl: string) => Promise<void>;
}) {
    const { app, oldUrl, filename, mimetype, stream, updateDb } = args;
    const storage = app.storage;

    const uploaded = await storage.upload({
        filename,
        mimetype,
        stream,
    });

    try {
        await updateDb(uploaded.url);
    } catch (err) {
        try {
            await storage.delete(uploaded.url);
        } catch { }
        throw err;
    }

    if (oldUrl && storage.isManagedUrl(oldUrl) && oldUrl !== uploaded.url) {
        try {
            await storage.delete(oldUrl);
        } catch (err) {
            app.log.warn({ err, oldUrl }, "failed to delete old media");
        }
    }

    return uploaded;
}

export async function deleteManagedMediaIfOwned(args: {
    app: FastifyWithStorage;
    url?: string | null;
}) {
    const { app, url } = args;
    const storage = app.storage;

    if (!url) return;
    if (!storage.isManagedUrl(url)) return;

    try {
        await storage.delete(url);
    } catch (err) {
        app.log.warn({ err, url }, "failed to delete managed media");
    }
}