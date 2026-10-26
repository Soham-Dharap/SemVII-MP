"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut, User, Sparkles, Settings } from "lucide-react";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "../hooks/use-current-user";

const UserButton = () => {
  const user = useCurrentUser();

  if (!user) {
    return (
      <a
        href="/auth/sign-in"
        className="inline-flex h-7 items-center justify-center rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Sign in
      </a>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        <div className={cn("relative rounded-full ring-2 ring-border hover:ring-foreground/10 transition-all")}>
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.image!} alt={user?.name!} />
            <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-semibold">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-4 w-64 rounded-[16px] p-2 bg-popover border border-border shadow-xl" align="end">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image!} alt={user?.name!} />
            <AvatarFallback className="bg-secondary">
              <User className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold tracking-[-0.01em] truncate">
              {user?.name || "User"}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
          </div>
          <div className="h-6 rounded-full bg-secondary border border-border px-2 flex items-center">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
        </div>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="rounded-full text-[13px]">
          <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
          Preferences
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="rounded-full text-[13px] text-destructive focus:text-destructive focus:bg-destructive/10">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
