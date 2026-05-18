import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function recordProfileVisit(input: {
  profileId: number;
  sessionId: string;
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  referrer?: string | null;
}) {
  return prisma.profileVisit.upsert({
    where: {
      profileId_sessionId: { profileId: input.profileId, sessionId: input.sessionId },
    },
    create: {
      profileId: input.profileId,
      sessionId: input.sessionId,
      source: input.source ?? undefined,
      medium: input.medium ?? undefined,
      campaign: input.campaign ?? undefined,
      referrer: input.referrer ?? undefined,
    },
    update: {}, // idempotent
  });
}
