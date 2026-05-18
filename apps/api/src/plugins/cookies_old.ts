import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";

export default fp(async (app) => {
    app.register(fastifyCookie, {
        // optional but recommended if you set signed cookies
        secret: process.env.COOKIE_SECRET,
    });
});
