"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "../hooks/use-current-user";

const UserButton = () => {
  const user = useCurrentUser();
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-ring/60 transition data-focus-visible:ring-3">
        <Avatar className="size-9 border border-border shadow-sm transition-transform duration-200 hover:scale-105">
          <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
          <AvatarFallback className="bg-iris text-sm font-semibold text-white">
            {user?.image ? <User className="size-4" /> : initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-4 w-60" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col gap-0.5 font-normal">
          <span className="truncate text-sm font-semibold text-foreground">
            {user?.name ?? "Signed in"}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard">
          <DropdownMenuItem>
            <LayoutDashboard className="mr-2 size-4" />
            Dashboard
          </DropdownMenuItem>
        </Link>
        <Link href="/">
          <DropdownMenuItem>
            <Home className="mr-2 size-4" />
            Home page
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem variant="destructive">
            <LogOut className="mr-2 size-4" />
            Sign out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
