import { FastifyInstance } from "fastify";
import * as ctrl from "../controllers/project.controller";

export async function projectRoutes(app: FastifyInstance) {
    // ---------- Public ----------
    // List projects on a profile page (published only unless owner)
    // GET /projects/profile/123
    app.get("/projects/projectByProfileId/:profileId(\\d+)", ctrl.listProjectsByProfile);

    // ---------- Protected ----------
    const auth = { preHandler: [app.authenticate] as const };

    // Mine (optionally filter by ?profileId=)
    // GET /projects
    app.get("/projects/listMyProject/:profileId(\\d+)", { preHandler: [app.authenticate] }, ctrl.listMyProjects);

    // One (edit view)
    // GET /projects/:id
    app.get("/projects/projectById/:id(\\d+)", { preHandler: [app.authenticate] }, ctrl.getProjectById);

    // Project Public view)
    // GET /projects/:id
    app.get("/projects/projectPublicViewById/:id(\\d+)", ctrl.projectPublicViewById);

    app.get("/projects/explore", ctrl.listExploreProjects);

    // Create (body contains profileId)
    // POST /projects
    app.post("/projects", { preHandler: [app.authenticate] }, ctrl.createProject);

    // Update (partial/full)
    // PATCH /projects/:id
    app.patch("/projects/:id(\\d+)", { preHandler: [app.authenticate] }, ctrl.updateProject);

    // Delete
    // DELETE /projects/:id
    app.delete("/projects/:id(\\d+)", { preHandler: [app.authenticate] }, ctrl.deleteProject);

    // Bulk reorder projects (by sort_order)
    // POST /projects/reorder
    app.post("/projects/reorder", { preHandler: [app.authenticate] }, ctrl.reorderProjects);

    // ---------- Sectioned updates ----------
    // Basic section
    app.patch("/projects/:id(\\d+)/basic", { preHandler: [app.authenticate] }, ctrl.updateProjectBasic);

    // Story section
    app.patch("/projects/:id(\\d+)/story", { preHandler: [app.authenticate] }, ctrl.updateProjectStory);

    // Contact & Address section
    app.patch("/projects/:id(\\d+)/contact", { preHandler: [app.authenticate] }, ctrl.updateProjectContact);

    // Social links (replace whole array)
    app.patch("/projects/:id(\\d+)/social-links", { preHandler: [app.authenticate] }, ctrl.replaceSocialLinks);

    // Social links: add / delete / reorder
    app.post("/projects/:id(\\d+)/social-links", { preHandler: [app.authenticate] }, ctrl.addSocialLink);
    app.delete("/projects/:id(\\d+)/social-links/:linkId", { preHandler: [app.authenticate] }, ctrl.deleteSocialLink);
    app.post("/projects/:id(\\d+)/social-links/reorder", { preHandler: [app.authenticate] }, ctrl.reorderSocialLinks);

    // Service packages & scope
    app.post("/projects/:id(\\d+)/packages", { preHandler: [app.authenticate] }, ctrl.createProjectPackage);
    app.patch("/projects/:id(\\d+)/packages/:packageId", { preHandler: [app.authenticate] }, ctrl.updateProjectPackage);
    app.delete("/projects/:id(\\d+)/packages/:packageId", { preHandler: [app.authenticate] }, ctrl.deleteProjectPackage);
    app.patch("/projects/:id(\\d+)/scope", { preHandler: [app.authenticate] }, ctrl.updateProjectScope);

    // Project journey milestones
    app.post("/projects/:id(\\d+)/milestones", { preHandler: [app.authenticate] }, ctrl.createProjectMilestone);
    app.patch("/projects/:id(\\d+)/milestones/:milestoneId", { preHandler: [app.authenticate] }, ctrl.updateProjectMilestone);
    app.delete("/projects/:id(\\d+)/milestones/:milestoneId", { preHandler: [app.authenticate] }, ctrl.deleteProjectMilestone);

    // Tracking (public)
    app.post("/projects/:id(\\d+)/visit", ctrl.trackProjectVisit);
    app.get("/projects/r/:id(\\d+)/site", ctrl.redirectProjectSite);
    app.get("/projects/r/link/:linkId", ctrl.redirectProjectLink);

    // (optional) stats for owner (auth)
    app.get("/projects/:id(\\d+)/stats", { preHandler: app.authenticate }, ctrl.getProjectStats);

    // --- Bookmarks & Follows (protected) ---
    app.post("/projects/:id(\\d+)/bookmark", { preHandler: app.authenticate }, ctrl.bookmarkProject);
    app.delete("/projects/:id(\\d+)/bookmark", { preHandler: app.authenticate }, ctrl.unbookmarkProject);

    app.post("/projects/:id(\\d+)/follow", { preHandler: app.authenticate }, ctrl.followProject);
    app.delete("/projects/:id(\\d+)/follow", { preHandler: app.authenticate }, ctrl.unfollowProject);
    app.patch("/projects/:id(\\d+)/updateHeroBanner", { preHandler: app.authenticate }, ctrl.updateHeroBanner);

    // relation state for current user (bookmarked/following + counts)
    app.get("/projects/:id(\\d+)/state", { preHandler: app.authenticate }, ctrl.getMyProjectRelationState);

    // lists for "My Quick Links"
    app.get("/projects/me/bookmarks", { preHandler: app.authenticate }, ctrl.listMyBookmarkedProjects);
    app.get("/projects/me/follows", { preHandler: app.authenticate }, ctrl.listMyFollowedProjects);

    // (optional) one endpoint that returns everything for the sidebar
    app.get("/projects/me/quicklinks", { preHandler: app.authenticate }, ctrl.getMyQuickLinks);
}
