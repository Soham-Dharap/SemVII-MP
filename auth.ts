import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getAccountByUserId, getUserById } from "@/features/auth/actions";
import type { UserRole } from "@/features/auth/type";

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
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role as UserRole;
      // Keep the provider available for future provider-scoped features.
      token.provider = existingAccount?.provider;

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
