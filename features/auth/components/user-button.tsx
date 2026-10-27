"use client";
import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  LayoutDashboard,
  LogOut,
  User,
  UserRound,
} from "lucide-react";
import { useCurrentUser } from "../hooks/use-current-user";

/**
 * Hand-rolled menu (no portal/floating-ui dependency): a controlled popover
 * with click-outside and Escape handling. Every navigation target is a real
 * anchor, so links work regardless of hydration or focus-manager state.
 */
const UserButton = () => {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  const close = useCallback(() => setOpen(false), []);

  // Close on outside press.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const itemClass =
    "flex w-full items-center rounded-lg px-2.5 py-2 text-sm text-foreground/90 transition-colors hover:bg-muted";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-full outline-none ring-ring/60 transition focus-visible:ring-3"
      >
        <Avatar className="size-9 border border-border shadow-sm transition-transform duration-200 hover:scale-105">
          <AvatarImage
            src={user?.image ?? undefined}
            alt={user?.name ?? "User"}
          />
          <AvatarFallback className="bg-iris text-sm font-semibold text-white">
            {user?.image ? <User className="size-4" /> : initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-[60] mt-2 w-60 origin-top-right animate-scale-in rounded-xl bg-popover p-1.5 text-popover-foreground shadow-xl ring-1 ring-foreground/10"
        >
          <div className="flex min-w-0 flex-col gap-0.5 px-2.5 py-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {user?.name ?? "Signed in"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <div className="-mx-1.5 my-1 h-px bg-border" />
          <Link
            href="/dashboard/profile"
            role="menuitem"
            className={itemClass}
            onClick={close}
          >
            <UserRound className="mr-2 size-4" />
            Your profile
          </Link>
          <Link
            href="/dashboard"
            role="menuitem"
            className={itemClass}
            onClick={close}
          >
            <LayoutDashboard className="mr-2 size-4" />
            Dashboard
          </Link>
          <Link href="/" role="menuitem" className={itemClass} onClick={close}>
            <Home className="mr-2 size-4" />
            Home page
          </Link>
          <div className="-mx-1.5 my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ redirectTo: "/" })}
            className={`${itemClass} text-destructive hover:bg-destructive/10`}
          >
            <LogOut className="mr-2 size-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
