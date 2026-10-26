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
        className="inline-flex h-7 items-center justify-center rounded-full bg-[#0071e3] px-4 text-[12px] font-medium text-white hover:bg-[#0077ed] transition-colors"
      >
        Sign in
      </a>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className={cn("relative rounded-full ring-2 ring-black/5 dark:ring-white/10 hover:ring-black/10 transition-all")}>
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.image!} alt={user?.name!} />
            <AvatarFallback className="bg-gradient-to-br from-[#0071e3] to-[#42a5f5] text-white text-[11px] font-semibold">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#34c759] border-2 border-white dark:border-black" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-4 w-64 rounded-[16px] p-2 bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 shadow-xl" align="end">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image!} alt={user?.name!} />
            <AvatarFallback className="bg-[#f5f5f7] dark:bg-[#2c2c2e]">
              <User className="h-4 w-4 text-[#86868b]" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-white truncate">
              {user?.name || "User"}
            </div>
            <div className="text-[11px] text-[#86868b] truncate">{user?.email}</div>
          </div>
          <div className="h-6 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] px-2 flex items-center">
            <Sparkles className="h-3 w-3 text-[#0071e3]" />
          </div>
        </div>
        <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10 my-2" />
        <DropdownMenuItem className="rounded-full text-[13px]">
          <Settings className="h-4 w-4 mr-2 text-[#86868b]" />
          Preferences
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="rounded-full text-[13px] text-[#ff3b30] focus:text-[#ff3b30] focus:bg-[#ff3b30]/10">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
