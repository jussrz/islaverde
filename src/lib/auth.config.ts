import type { NextAuthConfig } from "next-auth";

// Edge-safe subset of the auth config: no Prisma/adapter/Credentials.authorize
// here, since those need the Node runtime. middleware.ts builds its own
// NextAuth instance from just this config to decide route access from the
// JWT alone. The full config (src/lib/auth.ts) extends this with the
// Prisma adapter and the Credentials provider for actual sign-in.
export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "GUEST" | "ADMIN";
      }
      return session;
    },
    authorized: ({ auth: session, request }) => {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/admin")) {
        return session?.user?.role === "ADMIN";
      }
      if (pathname.startsWith("/account")) {
        return Boolean(session?.user);
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
