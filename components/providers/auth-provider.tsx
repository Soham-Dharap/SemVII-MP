"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Client-side session provider. No session is passed from the server, so the
 * root layout stays static (NextAuth fetches the session on mount via
 * /api/auth/session). Server components that need the user call auth()
 * directly and opt themselves into dynamic rendering.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
