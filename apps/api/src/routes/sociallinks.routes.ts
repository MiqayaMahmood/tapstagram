// src/routes/socialLinks.routes.ts
import { FastifyInstance } from "fastify";
import * as ctrl from "../controllers/socialLinks.controller";

export async function socialLinksRoutes(app: FastifyInstance) {
    // Public
    app.get("/social-links/:profileId", ctrl.listSocialLinksByProfile);

    // Protected (all require auth)
    app.register(async (auth) => {
        auth.addHook("preHandler", auth.authenticate);

        auth.get("/social-links", ctrl.listMySocialLinks);
        auth.post("/social-links", ctrl.createSocialLink);
        auth.patch("/social-links/:id", ctrl.updateSocialLink);
        auth.delete("/social-links/:id", ctrl.deleteSocialLink);
        auth.post("/social-links/reorder", ctrl.reorderSocialLinks);
    });
}
