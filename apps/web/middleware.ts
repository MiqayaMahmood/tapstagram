import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//import crypto from "crypto";

export function middleware(req: NextRequest) {

    function getNextResponse(req: NextRequest) {
        const { pathname } = req.nextUrl;
        const m = pathname.match(/^\/@([^\/]+)$/); // /@username
        if (m) {
            const url = req.nextUrl.clone();
            url.pathname = `/${m[1]}`;
            return NextResponse.rewrite(url);
        }
        return NextResponse.next();
    }
    //const res = NextResponse.next();
    const res = getNextResponse(req);

    if (!req.cookies.get("tsid")) {
        res.cookies.set({
            name: "tsid",
            value: crypto.randomUUID(),
            httpOnly: false,              // <-- readable by client JS
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            // domain: ".tapstagram.com", // uncomment if API is on a subdomain
        });
    }
    return res;
}
export const config = { matcher: ["/@:username/:path*", "/@:username"] };
