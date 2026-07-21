"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
import {
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  Settings,
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  MessageSquare,
  HelpCircle,
  UserPlus,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUnreadCount } from "@/hooks/use-unread-count";

// ── Navigation items ─────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Resources", href: "/resources", icon: BookOpen },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Discussions", href: "/discussions", icon: MessageSquare },
  { label: "Q&A", href: "/qa", icon: HelpCircle },
  { label: "AI Assistant", href: "/ai", icon: Sparkles },
  { label: "Connections", href: "/connections", icon: UserPlus },
  { label: "Messages", href: "/messages", icon: MessageCircle },
];

// ── Component ────────────────────────────────────────────────────────────────

interface TopNavProps {
  /** Current user's display name. */
  userName?: string;
  /** Current user's avatar URL. */
  userImage?: string;
}

export function TopNav({ userName, userImage }: TopNavProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { count: unreadCount } = useUnreadCount();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-4 px-4 sm:px-6">
        {/* ── Logo / Brand ─────────────────────────────────────────────── */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            N
          </div>
          <span className="hidden text-sm font-semibold sm:inline-block">
            Smart NUB
          </span>
        </Link>

        {/* ── Desktop navigation links ─────────────────────────────────── */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Right side: Search + Actions ─────────────────────────────── */}
        <div className="ml-auto flex items-center gap-2">
          {/* ── Search (desktop) ────────────────────────────────────────── */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 pl-8 text-sm lg:w-64"
            />
          </div>

          {/* ── Theme toggle ────────────────────────────────────────────── */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="size-8"
          >
            {isDark ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          {/* ── Notifications ───────────────────────────────────────────── */}
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative size-8">
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </Link>

          {/* ── User avatar / dropdown (desktop) ────────────────────────── */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="size-8 rounded-full">
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
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 cursor-pointer"
                  >
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

          {/* ── Mobile hamburger ────────────────────────────────────────── */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          {/* ── Mobile search ──────────────────────────────────────────── */}
          <div className="px-4 pt-3 sm:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 text-sm"
              />
            </div>
          </div>

          {/* ── Mobile nav links ───────────────────────────────────────── */}
          <nav className="space-y-1 px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Mobile user section ────────────────────────────────────── */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName ?? "User"}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {userName?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{userName ?? "User"}</p>
                  <Link
                    href="/settings"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="size-8 text-destructive">
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
