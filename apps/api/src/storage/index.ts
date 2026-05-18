
import { LocalStorage } from "./local";
import { S3Storage } from "./s3.storage";
import type { MediaStorage } from "./types";

let storage: MediaStorage;

export function getStorage(): MediaStorage {
    if (storage) return storage;

    const driver = (process.env.STORAGE_DRIVER || "local").toLowerCase();

    if (driver === "s3") {
        storage = new S3Storage();
    } else {
        storage = new LocalStorage();
    }

    return storage;
}