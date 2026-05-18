import { FastifyInstance } from 'fastify';
import {
    listMyBookmarks,
    createBookmark,
    deleteBookmark,
    isBookmarked,
    bookmarkCount,
} from '../controllers/projectBookmarks.controller';

export async function projectBookmarksRoutes(app: FastifyInstance) {
    // GET /bookmarks  (protected)
    app.get('/', { preHandler: [app.authenticate] }, listMyBookmarks);

    // POST /bookmarks  (protected)  Body: { profileId: number }
    app.post<{ Body: { projectId: number } }>(
        '/',
        { preHandler: [app.authenticate] },
        createBookmark
    );

    // DELETE /bookmarks/:profileId  (protected)  Params: { profileId: string }
    app.delete<{ Params: { projectId: string } }>(
        '/:projectId',
        { preHandler: [app.authenticate] },
        deleteBookmark
    );

    // GET /bookmarks/check/:profileId  (protected)  Params: { profileId: string }
    app.get<{ Params: { projectId: string } }>(
        '/check/:projectId',
        { preHandler: [app.authenticate] },
        isBookmarked
    );

    // GET /bookmarks/count/:profileId  (public)  Params: { profileId: string }
    app.get<{ Params: { projectId: string } }>(
        '/count/:projectId',
        bookmarkCount
    );
}
