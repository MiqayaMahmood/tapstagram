//// pages/api/username/check.ts (Pages Router)
//// If using App Router, use app/api/username/check/route.ts (POST/GET handlers)
//import type { NextApiRequest, NextApiResponse } from "next";
//import { PrismaClient } from "@prisma/client";
//const prisma = new PrismaClient();
//import { validateUsername, normalizeUsername,   usernameReasonToMessage, suggestUsernames } from "../../src/utils/validate";


//export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//  try {
//    const raw = String(req.query.username || "");
//    const username = normalizeUsername(raw);
//      const valid = validateUsername(username);
//    if (!valid.ok) {
//      return res.status(200).json({
//        ok: false,
//        username,
//          reason: usernameReasonToMessage(valid.code),
//        suggestions: suggestUsernames(username)
//      });
//    }

//    const exists = await prisma.profile.findUnique({ where: { username } });
//    return res.status(200).json({
//      ok: !Boolean(exists),
//      username,
//      reason: !exists ? null : "That username is taken.",
//      suggestions: exists ? suggestUsernames(username) : []
//    });
//  } catch (e) {
//    console.error(e);
//    return res.status(500).json({ ok: false, reason: "Server error" });
//  }
//}
