import fp from "fastify-plugin";
import { getStorage } from "../storage";

declare module "fastify" {
    interface FastifyInstance {
        storage: ReturnType<typeof getStorage>;
    }
}

export default fp(async (app) => {
    app.decorate("storage", getStorage());
});
