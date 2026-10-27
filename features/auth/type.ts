export const USER_ROLES = ["ADMIN", "USER", "PREMIUM_USER"] as const;

export type UserRole = (typeof USER_ROLES)[number];
