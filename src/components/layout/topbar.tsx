"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, Moon, Sun, LogOut, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useUnreadCount } from "@/hooks/use-unread-count";

interface TopbarProps {
  /** Current user's display name. */
  userName?: string;
  /** Current user's avatar URL. */
  userImage?: string;
}

export function Topbar({ userName, userImage }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { count: unreadCount } = useUnreadCount();
  const [searchQuery, setSearchQuery] = useState("");

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search resources, discussions, questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 pl-9 text-sm"
        />
      </div>

      <div className="flex items-center gap-1">
        {/* ── Theme toggle ─────────────────────────────────────────────── */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        {/* ── Notifications ────────────────────────────────────────────── */}
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* ── User menu ────────────────────────────────────────────────── */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="rounded-full">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName ?? "User"}
                  className="size-7 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {userName?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {userName ?? "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  View profile
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
