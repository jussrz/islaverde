import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// A separate, edge-safe NextAuth instance — built only from the Prisma-free
// config so middleware never bundles the Prisma client (Node-only APIs
// aren't available in the Edge runtime). Shares AUTH_SECRET with the main
// instance in src/lib/auth.ts, so JWTs issued by one are read by the other.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/profile/:path*"],
};
