import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';


import dotenv from 'dotenv';
import path from "node:path";
import { socialRoutes } from './src/routes/social.routes';
import rateLimit from './src/plugins/rate-limit';
import { authRoutes } from './src/routes/auth.routes';
import  recommendationsRoutes from './src/routes/recommendations.route';

import { FastifyRequest, FastifyReply } from 'fastify';
import fastifyStatic from "@fastify/static";
import prismaPlugin from './src/plugins/prisma';
import authPlugin from './src/plugins/auth';
import { socialLinksRoutes } from './src/routes/sociallinks.routes';
import { projectRoutes } from './src/routes/project.routes';
import { profileBookmarksRoutes } from './src/routes/profileBookmarks.routes';
import { profileFollowsRoutes } from './src/routes/profileFollows.routes';
import { projectBookmarksRoutes } from './src/routes/projectBookmarks.routes';
import { projectFollowsRoutes } from './src/routes/projectFollows.routes';

import analyticsVisitRoutes from "./src/routes/analytics.visit.routes";
import analyticsRoutes from "./src/routes/analytics.routes";
import { profileMeRoutes } from "./src/routes/profile.me.routes";
import { profilesPublicRoutes } from "./src/routes/profiles.public.routes";
import { profileRoutes } from './src/routes/profile.routes';
import multipart from '@fastify/multipart';
import fs from 'node:fs';
import storgePlugin from './src/plugins/storage'
import { uploadsRoutes } from './src/routes/uploads.routes';
import { profileMediaRoutes } from './src/routes/profile.media.routes';
import networkRoutes from "./src/routes/network.routes";

//import profilePresentationRoutes from "./src/routes/profile.presentation.routes";
import projectPresentationRoutes from "./src/routes/project.presentation.routes";

// Load .env variables
dotenv.config();
const prisma = new PrismaClient();

const app = Fastify({
    logger: true
});

//app.register(multipart, { limits: { fileSize: 8 * 1024 * 1024 } });
app.register(multipart, {
    limits: {
        fileSize: Number(process.env.S3_UPLOAD_MAX_MB || 50) * 1024 * 1024,
        files: 1,
    },
});

app.decorate('db', prisma );

const MEDIA_DIR = process.env.MEDIA_DIR || path.join(process.cwd(), "media");
if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });

// Register plugins
app.register(cors, {
    origin: [
        /^https?:\/\/localhost:\d+$/,
        "https://tapstagram.com",
        "https://www.tapstagram.com",
        "https://tapstagram.vercel.app/",
        "http://localhost:3000",
        "http://127.0.0.1:3000"], 

    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
    allowedHeaders: ["content-type",
        "authorization",  // lower-case is safest for preflight
        "Authorization",
        "x-tsid",],
        credentials: true,   // fine even if you’re using Bearer tokens
        maxAge: 86400,
        });
app.register(formbody);
app.register(helmet, {
    contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' }, 
    crossOriginEmbedderPolicy: false,});
app.register(jwt, { secret: process.env.JWT_SECRET || 'supersecret' });
app.register(prismaPlugin);
app.register(authPlugin);
app.register(profileMeRoutes);
app.register(rateLimit);
app.register(storgePlugin);


app.register(authRoutes, { prefix: '/auth' });

app.register(socialRoutes, { prefix: '' });
app.register(socialLinksRoutes);
app.register(projectRoutes );
app.register(networkRoutes);

app.register(profilesPublicRoutes);
app.register(recommendationsRoutes);
//app.register(profileSearchRoutes, { prefix: '/profiles' });

app.register(profileFollowsRoutes, { prefix: '/profileFollows' });
app.register(profileBookmarksRoutes, { prefix: '/profileBookmarks' });

app.register(projectFollowsRoutes, { prefix: '/projectFollows' });
app.register(projectBookmarksRoutes, { prefix: '/projectBookmarks' });

app.register(analyticsVisitRoutes, { prefix: '/analyticsVisit' });
app.register(analyticsRoutes, { prefix: '/analytics' });
app.register(uploadsRoutes);

// Routes
app.register(profileRoutes, { prefix: '/profile' });
app.register(fastifyStatic, {root: MEDIA_DIR,prefix: "/media/",});
app.register(profileMediaRoutes);

//app.register(profilePresentationRoutes);
app.register(projectPresentationRoutes);

app.get("/", async (_request, reply) => {
    return reply.send({
        status: "ok",
        app: "Tapstagram API",
        version: "1.0.0",
    });
});

app.get("/health", async (_request, reply) => {
    return reply.send({
        healthy: true,
        timestamp: new Date().toISOString(),
    });
});

// Start server
const start = async () => {
    try {
        const PORT = Number(process.env.PORT) || 5000;
        await app.listen({ port: PORT, host: '0.0.0.0' });

        
        app.log.info(`🚀 Server running on port ${process.env.PORT || 5000}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
