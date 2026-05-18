export async function uploadImage(file: File): Promise<{ url: string }> {
    // in production: upload to S3/Cloudinary etc and return the hosted URL
    const objectUrl = URL.createObjectURL(file);
    return { url: objectUrl };
}