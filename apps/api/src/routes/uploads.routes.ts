import { FastifyInstance } from "fastify";
import { replaceManagedMedia } from "../utils/media";
import { deleteManagedMediaIfOwned } from "../utils/media";

const MAX_MB = Number(process.env.S3_UPLOAD_MAX_MB || 50);
const MAX_BYTES = MAX_MB * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

export async function uploadsRoutes(app: FastifyInstance) {
  // add { preHandler: [app.authenticate] } if uploads should require login
  app.post("/uploads", async (req, reply) => {
    const mp = await req.file();

    if (!mp) {
      return reply.code(400).send({ ok: false, error: "NO_FILE" });
    }

    if (!ALLOWED_MIME.has(mp.mimetype)) {
      return reply.code(400).send({
        ok: false,
        error: "UNSUPPORTED_FILE_TYPE",
        message: "Only PNG, JPEG, WEBP, and GIF files are allowed.",
      });
    }

    const contentLengthHeader = req.headers["content-length"];
    const contentLength = typeof contentLengthHeader === "string"
      ? Number(contentLengthHeader)
      : Array.isArray(contentLengthHeader)
        ? Number(contentLengthHeader[0])
        : NaN;

    if (Number.isFinite(contentLength) && contentLength > MAX_BYTES) {
      return reply.code(413).send({
        ok: false,
        error: "FILE_TOO_LARGE",
        message: `Maximum upload size is ${MAX_MB}MB.`,
      });
    }

    try {
      const result = await req.server.storage.upload({
        filename: mp.filename || "upload.bin",
        mimetype: mp.mimetype,
        stream: mp.file,
      });

      return reply.send({
        ok: true,
        url: result.url,
        key: result.key,
      });
    } catch (err) {
      req.log.error({ err }, "upload failed");
      return reply.code(500).send({
        ok: false,
        error: "UPLOAD_FAILED",
        message: "The file could not be uploaded.",
      });
    }
  });

app.post("/uploads_old", async (req, reply) => {
    const mp = await req.file();

    if (!mp) {
        return reply.code(400).send({ ok: false, error: "NO_FILE" });
    }

    if (!ALLOWED_MIME.has(mp.mimetype)) {
        return reply.code(400).send({
            ok: false,
            error: "UNSUPPORTED_FILE_TYPE",
            message: "Only PNG, JPEG, WEBP, and GIF files are allowed.",
        });
    }

    const contentLengthHeader = req.headers["content-length"];
    const contentLength = typeof contentLengthHeader === "string"
        ? Number(contentLengthHeader)
        : Array.isArray(contentLengthHeader)
            ? Number(contentLengthHeader[0])
            : NaN;

    if (Number.isFinite(contentLength) && contentLength > MAX_BYTES) {
        return reply.code(413).send({
            ok: false,
            error: "FILE_TOO_LARGE",
            message: `Maximum upload size is ${MAX_MB}MB.`,
        });
    }

    try {
        const result = await req.server.storage.upload({
            filename: mp.filename || "upload.bin",
            mimetype: mp.mimetype,
            stream: mp.file,
        });

        return reply.send({
            ok: true,
            url: result.url,
            key: result.key,
        });
    } catch (err) {
        req.log.error({ err }, "upload failed");
        return reply.code(500).send({
            ok: false,
            error: "UPLOAD_FAILED",
            message: "The file could not be uploaded.",
        });
    }
});
    app.post("/profiles/me/hero-banner", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);
        const mp = await req.file();

        if (!mp) {
            return reply.code(400).send({ ok: false, error: "NO_FILE" });
        }

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: { id: true, hero_banner_url: true },
        });

        if (!me) {
            return reply.code(404).send({ ok: false, error: "PROFILE_NOT_FOUND" });
        }

        const uploaded = await replaceManagedMedia({
            app: req.server,
            oldUrl: me.hero_banner_url,
            filename: mp.filename || "hero.bin",
            mimetype: mp.mimetype,
            stream: mp.file,
            updateDb: async (newUrl) => {
                await req.server.prisma.profile.update({
                    where: { id: me.id },
                    data: { hero_banner_url: newUrl },
                });
            },
        });

        return reply.send({ ok: true, url: uploaded.url, key: uploaded.key });
    });

    app.post("/projects/:id/cover", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);
        const projectId = Number((req.params as any).id);
        const mp = await req.file();

        if (!mp) {
            return reply.code(400).send({ ok: false, error: "NO_FILE" });
        }

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!me) {
            return reply.code(404).send({ ok: false, error: "PROFILE_NOT_FOUND" });
        }

        const project = await req.server.prisma.project.findFirst({
            where: { id: projectId, profileId: me.id },
            select: { id: true, coverImageUrl: true },
        });

        if (!project) {
            return reply.code(404).send({ ok: false, error: "PROJECT_NOT_FOUND" });
        }

        const uploaded = await replaceManagedMedia({
            app: req.server,
            oldUrl: project.coverImageUrl,
            filename: mp.filename || "project-cover.bin",
            mimetype: mp.mimetype,
            stream: mp.file,
            updateDb: async (newUrl) => {
                await req.server.prisma.project.update({
                    where: { id: project.id },
                    data: { coverImageUrl: newUrl },
                });
            },
        });

        return reply.send({ ok: true, url: uploaded.url, key: uploaded.key });
    });

    app.delete("/profiles/me/avatar", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: { id: true, profile_picture_url: true },
        });

        if (!me) {
            return reply.code(404).send({ ok: false, error: "PROFILE_NOT_FOUND" });
        }

        const oldUrl = me.profile_picture_url;

        await req.server.prisma.profile.update({
            where: { id: me.id },
            data: { profile_picture_url: null },
        });

        await deleteManagedMediaIfOwned({
            app: req.server,
            url: oldUrl,
        });

        return reply.code(204).send();
    });

    app.delete("/profiles/me/hero-banner", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: { id: true, hero_banner_url: true },
        });

        if (!me) {
            return reply.code(404).send({ ok: false, error: "PROFILE_NOT_FOUND" });
        }

        const oldUrl = me.hero_banner_url;

        await req.server.prisma.profile.update({
            where: { id: me.id },
            data: { hero_banner_url: null },
        });

        await deleteManagedMediaIfOwned({
            app: req.server,
            url: oldUrl,
        });

        return reply.code(204).send();
    });

    app.delete("/projects/:id/cover", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);
        const projectId = Number((req.params as any).id);

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!me) {
            return reply.code(404).send({ ok: false, error: "PROFILE_NOT_FOUND" });
        }

        const project = await req.server.prisma.project.findFirst({
            where: { id: projectId, profileId: me.id },
            select: { id: true, coverImageUrl: true },
        });

        if (!project) {
            return reply.code(404).send({ ok: false, error: "PROJECT_NOT_FOUND" });
        }

        const oldUrl = project.coverImageUrl;

        await req.server.prisma.project.update({
            where: { id: project.id },
            data: { coverImageUrl: null },
        });

        await deleteManagedMediaIfOwned({
            app: req.server,
            url: oldUrl,
        });

        return reply.code(204).send();
    });
}