import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { signJwt } from "../utils/jwt";
//import jwt from '@fastify/jwt'; // types only; token via req.server.jwt

async function generateUniqueUsername(
    prisma: any,
    name: string | null | undefined,
    email: string
): Promise<string> {
    const seed = (name?.trim() || email.split("@")[0] || "user")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .slice(0, 20) || "user";

    let candidate = seed;
    let i = 1;

    while (true) {
        const exists = await prisma.profile.findUnique({
            where: { username: candidate },
            select: { id: true },
        });

        if (!exists) return candidate;

        candidate = `${seed}${i}`;
        i += 1;
    }
}

export async function register(app: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
    const { email, password, name, isBusiness } = request.body as {
        email: string;
        password: string;
        name?: string;
        isBusiness?: boolean;
    };

    const existing = await request.server.prisma.user.findUnique({ where: { email } });
    if (existing) {
        return reply.code(400).send({ success: false, error: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await app.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                password_hash,
                name: name ?? null,
                is_business: !!isBusiness,
            },
            select: {
                id: true,
                email: true,
                name: true,
                is_business: true,
                created_at: true,
            },
        });

        const username = await generateUniqueUsername(tx, name, email);

        const profile = await tx.profile.create({
            data: {
                userId: user.id,
                name: name?.trim() || email.split("@")[0],
                email,
                username,
                plan: "free",
            },
            select: {
                id: true,
                userId: true,
                username: true,
                name: true,
                email: true,
            },
        });

        return { user, profile };
    });

    const token = signJwt({
        id: result.user.id,
        email: result.user.email,
    });

    reply.send({
        success: true,
        token,
        user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            is_business: result.user.is_business,
            created_at: result.user.created_at,
            profileId: result.profile.id,
            username: result.profile.username,
        },
    });
}

export async function login(app: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as { email: string; password: string };

    const user = await app.prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            is_business: true,
            created_at: true,
            password_hash: true,
            profile: {
                select: {
                    id: true,
                    username: true,
                    plan: true,
                },
            },
        },
    });

    if (!user) {
        return reply.status(401).send({ error: "Invalid email or No account for provided email." });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
        return reply.status(401).send({ error: "Invalid credentials or incorrect password." });
    }

    const token = request.server.jwt.sign({
        id: user.id,
        email: user.email,
    });

    const { password_hash, profile, ...safeUser } = user;

    reply.send({
        success: true,
        token,
        user: {
            id: safeUser.id,
            email: safeUser.email,
            name: safeUser.name,
            is_business: safeUser.is_business,
            created_at: safeUser.created_at,
            profileId: profile?.id ?? null,
            username: profile?.username ?? null,
            plan: profile?.plan ?? null,
        },
    });
}


//export async function register(app: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
//    //const { email, password } = request.body as { email: string; password: string };
//    const { email, password, name, isBusiness } = request.body as {
//        email: string; password: string; name?: string; isBusiness?: boolean;
//    };
//    const existing = await request.server.prisma.user.findUnique({ where: { email } });
//    if (existing) return reply.code(400).send({ success: false, error: 'Email already in use' });

//    const password_hash = await bcrypt.hash(password, 10);

//    const user = await app.prisma.user.create({
//        data: {
//            email,
//            password_hash,
//            name: name ?? null,            // <— if your schema requires name, use a default instead
//            is_business: !!isBusiness,
//        },
//        select: { id: true, email: true, name: true, is_business: true, created_at: true },

//    });
    
//    const token = signJwt({ sub: user.id, is_business: user.is_business }); // <— use your helper
//    reply.send({ success: true, token, user });
//}

//export async function login(app: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
//    const { email, password } = request.body as { email: string; password: string };

//    const user = await app.prisma.user.findUnique({
//        where: { email },
//        select: { id: true, email: true, name: true, is_business: true, created_at: true, password_hash: true },
//    });
//    if (!user) return reply.status(401).send({ error: 'Invalid email or No account for provided email.' });

//    const isValid = await bcrypt.compare(password, user.password_hash);
    
//    //This part we can use to generate new Hash as well as test the hashed password.
//    const testHash = await bcrypt.hash(password, 10);

//    console.log('New hash:', testHash);
//    console.log("Plain passowrd: " + password)
//    console.log("Hashed passowrd from DB: " + user.password_hash)
    

//    if (!isValid) return reply.status(401).send({ error: 'Invalid credentials or incorrect password.' });

//    const token = request.server.jwt.sign({ id: user.id, email: user.email });
//    const { password_hash, ...safeUser } = user;

//    //const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

//    reply.send({ success: true, token, user: { id: user.id, email: user.email, name: user.name, is_business: user.is_business } });
//}
