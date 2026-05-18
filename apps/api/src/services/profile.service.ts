/* Profile service */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function slugify(s: string) {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");
}

export async function checkTitleAvailability(title: string, excludeId?: number) {
    const base = slugify(title);
    if (!base) return { ok: false as const, reason: "empty" };

    const exists = await prisma.profile.findFirst({
        where: { titleSlug: base, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
        select: { id: true },
    });
    if (!exists) return { ok: true as const, slug: base };

    const withRand = (b: string) => `${b}-${Math.floor(100 + Math.random() * 900)}`;
    for (let i = 0; i < 5; i++) {
        const candidate = withRand(base);
        const clash = await prisma.profile.findUnique({ where: { titleSlug: candidate } });
        if (!clash) return { ok: false as const, reason: "taken", slug: candidate };
    }
    return { ok: false as const, reason: "taken", slug: withRand(base) };
}

export async function checkUsernameAvailability(username: string, excludeId?: number) {
    console.log("checkUsernameAvailability - " + username + "excludeId: " + excludeId)
    const base = slugify(username);
    if (!base) return { ok: false as const, reason: "empty" };

    const exists = await prisma.profile.findFirst({
        where: { username: base, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
        select: { id: true },
    });
    if (!exists) return { ok: true as const, slug: base };

    const withRand = (b: string) => `${b}-${Math.floor(100 + Math.random() * 900)}`;
    for (let i = 0; i < 5; i++) {
        const candidate = withRand(base);
        const clash = await prisma.profile.findUnique({ where: { username: candidate } });
        if (!clash) return { ok: false as const, reason: "taken", slug: candidate };
    }
    return { ok: false as const, reason: "taken", slug: withRand(base) };
}

export async function saveProfileTitle(profileId: number, pTitle: string) {
    const slug = slugify(pTitle);
    return prisma.profile.update({
        where: { id: profileId },
        data: { title: pTitle, titleSlug: slug },
    });
}

export async function saveProfileUserName(profileId: number, pUsername: string) {
    
    return prisma.profile.update({
        where: { id: profileId },
        data: { username: pUsername },
    });
}

// ===== Username & media service helpers =====================================
import { normalizeUsername } from "../utils/validate";
// NOTE: adjust how you access prisma to match the rest of this file
//import { prisma } from "../plugins/prisma"; // <-- if your file already uses a different import, keep that pattern

export async function findProfileByUsername(username: string) {
    return prisma.profile.findUnique({
        where: { username: normalizeUsername(username) }
    });
}

export async function isUsernameTaken(username: string) {
    const u = normalizeUsername(username);
    const p = await prisma.profile.findUnique({ where: { username: u }, select: { userId: true } });
    return !!p;
}

export async function updateProfileUsername(userId: number, username: string) {
    return prisma.profile.update({
        where: { userId },
        data: { username: normalizeUsername(username) }
    });
}

export async function setProfileMediaUrl(userId: number, type: "avatar" | "banner", url: string) {
    const data = type === "avatar" ? { profile_picture_url: url } : { hero_banner_url: url };
    return prisma.profile.update({ where: { userId }, data });
}
