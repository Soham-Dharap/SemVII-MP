import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/features/auth/type";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  id: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

// next-auth/jwt re-exports @auth/core/jwt, so the augmentation must target
// the core module for the callback token typing to pick it up.
declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole;
    provider?: string;
  }
}
