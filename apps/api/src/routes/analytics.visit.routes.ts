import { FastifyInstance, FastifyRequest } from "fastify";
import { recordProfileVisit } from "../services/analytics.service";

type Body = {
    profileId: number;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
};
function getCookie(name: string) {
    return document.cookie
        .split("; ")
        .find(r => r.startsWith(name + "="))
        ?.split("=")[1];
}

export function getCookieServer(
    req: FastifyRequest,
    name: string
): string | undefined {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return undefined;

    return cookieHeader
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}

export default async function analyticsVisitRoutes(app: FastifyInstance) {
    app.post("/visit", async (req, reply) => {
        const body = req.body as Body;
        if (!body?.profileId) return reply.code(400).send({ ok: false, error: "MISSING_PROFILE_ID" });

        // session cookie = tsid (set by web app). If absent, generate short‑lived header fallback.
        const tsid =
            getCookieServer(req, "tsid") ||
            (req.headers["x-tsid"] as string | undefined) ||
            (req.headers["x-session-id"] as string | undefined);

        if (!tsid) return reply.code(400).send({ ok: false, error: "NO_SESSION" });

        const ref = req.headers.referer as string | undefined;

        await recordProfileVisit({
            profileId: Number(body.profileId),
            sessionId: String(tsid),
            source: body.utm_source,
            medium: body.utm_medium,
            campaign: body.utm_campaign,
            referrer: ref,
        });

        reply.send({ ok: true });
    });
}
