// pages/api/username/check.ts (Pages Router)
// If using App Router, use app/api/username/check/route.ts (POST/GET handlers)
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { isUsernameValid, normalizeUsername, usernameReasonToMessage, suggestUsernames } from "@/lib/usernames";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = String(req.query.username || "");
    const username = normalizeUsername(raw);
    const valid = isUsernameValid(username);
    if (!valid.ok) {
      return res.status(200).json({
        ok: false,
        username,
        reason: usernameReasonToMessage(valid.reason),
        suggestions: suggestUsernames(username)
      });
    }

    const exists = await prisma.profile.findUnique({ where: { username } });
    return res.status(200).json({
      ok: !Boolean(exists),
      username,
      reason: !exists ? null : "That username is taken.",
      suggestions: exists ? suggestUsernames(username) : []
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, reason: "Server error" });
  }
}
