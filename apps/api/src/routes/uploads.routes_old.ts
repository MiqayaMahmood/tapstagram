// src/routes/uploads.routes.ts
import { FastifyInstance } from 'fastify';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';

const MEDIA_DIR = path.join(process.cwd(), 'media');
const PUBLIC_BASE = process.env.PUBLIC_BASE_URL || 'http://localhost:5000';
const toPublic = (abs: string) => `${PUBLIC_BASE}/media/${path.basename(abs)}`;

export async function uploadsRoutes(app: FastifyInstance) {
    // optional auth: if you want only logged-in users to upload, add { preHandler:[app.authenticate] }
    app.post('/uploads', async (req, reply) => {
        const mp = await req.file(); // one file expected; for multiple use req.files()
        if (!mp) return reply.code(400).send({ ok: false, error: 'NO_FILE' });

        // naive mime → extension
        const ext =
            (mp.filename?.includes('.') && mp.filename.split('.').pop()) ||
            (mp.mimetype === 'image/png' ? 'png' :
                mp.mimetype === 'image/jpeg' ? 'jpg' :
                    'bin');

        const fname = `${Date.now()}-${randomUUID()}.${ext}`;
        const absPath = path.join(MEDIA_DIR, fname);
        const ws = fs.createWriteStream(absPath);

        const result = await req.server.storage.upload({
            filename: fname || 'upload.bin',
            mimetype: mp.mimetype,
            stream: mp.file,
        });
        reply.send({ ok: true, ...result }); 

    });
}
