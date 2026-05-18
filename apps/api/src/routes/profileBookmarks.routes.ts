import { FastifyInstance } from 'fastify';
import {
    listMyBookmarks,
    createBookmark,
    deleteBookmark,
    isBookmarked,
    bookmarkCount,
} from '../controllers/profileBookmarks.controller';

export async function profileBookmarksRoutes(app: FastifyInstance) {
    // GET /bookmarks  (protected)
    app.get('/', { preHandler: [app.authenticate] }, listMyBookmarks);

    // POST /bookmarks  (protected)  Body: { profileId: number }
    app.post<{ Body: { profileId: number } }>(
        '/',
        { preHandler: [app.authenticate] },
        createBookmark
    );

    // DELETE /bookmarks/:profileId  (protected)  Params: { profileId: string }
    app.delete<{ Params: { profileId: string } }>(
        '/:profileId',
        { preHandler: [app.authenticate] },
        deleteBookmark
    );

    // GET /bookmarks/check/:profileId  (protected)  Params: { profileId: string }
    app.get<{ Params: { profileId: string } }>(
        '/check/:profileId',
        { preHandler: [app.authenticate] },
        isBookmarked
    );

    // GET /bookmarks/count/:profileId  (public)  Params: { profileId: string }
    app.get<{ Params: { profileId: string } }>(
        '/count/:profileId',
        bookmarkCount
    );
}
