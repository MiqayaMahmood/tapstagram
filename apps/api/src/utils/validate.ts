// src/utils/validate.ts
import { ZodObject } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

export function validateBody(schema: ZodObject) {
    return (req: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => {
        const parsed = schema.safeParse((req as any).body);
        if (!parsed.success) {
            reply.code(400).send({ message: "Invalid body", issues: parsed.error.issues });
            return;
        }
        (req as any).validatedBody = parsed.data;
        done();
    };
}

export function validateParams(schema: ZodObject) {
    return (req: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => {
        const parsed = schema.safeParse((req as any).params);
        if (!parsed.success) {
            reply.code(400).send({ message: "Invalid params", issues: parsed.error.issues });
            return;
        }
        (req as any).validatedParams = parsed.data;
        done();
    };
}

export function validateQuery(schema: ZodObject) {
    return (req: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => {
        const parsed = schema.safeParse((req as any).query);
        if (!parsed.success) {
            reply.code(400).send({ message: "Invalid query", issues: parsed.error.issues });
            return;
        }
        (req as any).validatedQuery = parsed.data;
        done();
    };
}

// --- Username helpers (LinkedIn-style) ---------------------------------------
export const USERNAME_RESERVED = new Set([
    "api", "assets", "static", "images", "favicon.ico", "robots.txt", "sitemap.xml",
    "admin", "login", "logout", "register", "signup", "profile", "profiles", "settings",
    "explore", "discover", "search", "new", "edit", "inbox", "notifications", "privacy",
    "terms", "help", "support", "pricing", "about", "contact", "_next", "p"
]);

export function normalizeUsername(raw: string) {
    return String(raw || "")
        .trim()
        //.toLowerCase()
        //.replace(/\s+/g, "_")
        //.replace(/[^a-z0-9_.]/g, "");
}

export function validateUsername(u: string) {
    if (!u) return { ok: false, code: "empty" as const };
    if (u.length < 3 || u.length > 32) return { ok: false, code: "length" as const };
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9._]*[A-Za-z0-9])?$/.test(u)) return { ok: false, code: "charset" as const };
    if (u.includes("..") || u.includes("__") || u.includes("._") || u.includes("_.")) return { ok: false, code: "repeats" as const };
    if (USERNAME_RESERVED.has(u.toLowerCase())) return { ok: false, code: "reserved" as const };
    return { ok: true as const };
}

export function usernameReasonToMessage(code?: string) {
    switch (code) {
        case "empty": return "Please enter a username.";
        case "length": return "Must be 3–32 characters.";
        case "charset": return "Use letters, numbers, dots or underscores. Start/end with a letter or number.";
        case "repeats": return "Avoid consecutive separators.";
        case "reserved": return "That word is reserved.";
        default: return "Invalid username.";
    }
}

export function suggestUsernames(base: string, seed?: { name?: string; id?: number }) {
    const clean = normalizeUsername(base) || "user";
    const ideas = new Set<string>([
        clean,
        `${clean}${new Date().getFullYear()}`,
        `${clean}_1`,
        `${clean}_01`,
        `${clean}.1`,
        `${clean}_${Math.floor(100 + Math.random() * 900)}`
    ]);
    if (seed?.name) {
        const n = normalizeUsername(seed.name);
        ideas.add(n);
        ideas.add(`${n}_official`);
    }
    if (seed?.id) ideas.add(`${clean}${String(seed.id).slice(-3)}`);
    return Array.from(ideas).slice(0, 8);
}
