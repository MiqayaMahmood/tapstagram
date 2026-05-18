export type UploadResult = {
    url: string;      // public URL to store in DB
    key?: string;     // provider-specific id/path (optional but useful)
    width?: number;
    height?: number;
    mime?: string;
    size?: number;
};

export interface MediaStorage {
    toPublicUrl(keyOrUrl: string): string;
    isManagedUrl(keyOrUrl: string): boolean;
    upload(args: {
        filename: string;
        mimetype: string;
        stream: NodeJS.ReadableStream;
    }): Promise<UploadResult>;
    delete(keyOrUrl: string): Promise<void>;
}
