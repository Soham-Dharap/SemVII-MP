import type { ReactNode } from "react";

export interface LogoutButtonProps {
  children?: ReactNode;
}

export const USER_ROLES = ["ADMIN", "USER", "PREMIUM_USER"] as const;

export type UserRole = (typeof USER_ROLES)[number];
