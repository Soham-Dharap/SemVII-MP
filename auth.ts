import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getAccountByUserId, getUserById } from "@/features/auth/actions";
import type { UserRole } from "@/features/auth/type";

// Render injects the service's public URL (e.g. https://codepilot-4mjj.onrender.com).
// A stale or incorrect AUTH_URL — such as the internal https://localhost:10000
// address — otherwise overrides trustHost and forces every OAuth redirect to
// localhost, which no provider can accept. On Render, always derive AUTH_URL
// from the platform-provided external URL so OAuth stays correct even if the
// dashboard variable is wrong or the service gets a new subdomain.
if (process.env.RENDER_EXTERNAL_URL) {
  process.env.AUTH_URL = `${process.env.RENDER_EXTERNAL_URL}/api/auth`;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  // Render terminates TLS at its proxy, so the framework must trust the
  // forwarded host header when building callback URLs. AUTH_SECRET is read
  // automatically from the environment; in development NextAuth generates
  // one when it is absent.
  trustHost: true,
  callbacks: {
    async jwt({ token, trigger }) {
      if (!token.sub) return token;

      // The user snapshot is cached on the token after the first sign-in, so
      // normal navigation and preview polling do not pay for two Atlas
      // round-trips per request. Re-read only on an explicit update or when
      // the token predates the cache (e.g. an older session).
      if (trigger === "update" || !token.role || !("provider" in token)) {
        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;

        const existingAccount = await getAccountByUserId(existingUser.id);

        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role as UserRole;
        // Keep the provider available for future provider-scoped features.
        token.provider = existingAccount?.provider;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },
});
