"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  MessageSquare,
  HelpCircle,
  UserPlus,
  MessageCircle,
  Sparkles,
  Calendar,
  Trophy,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ── Navigation items ─────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Resources", href: "/resources", icon: BookOpen },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Discussions", href: "/discussions", icon: MessageSquare },
  { label: "Q&A", href: "/qa", icon: HelpCircle },
  { label: "Connections", href: "/connections", icon: UserPlus },
  { label: "Messages", href: "/messages", icon: MessageCircle },
  { label: "AI Assistant", href: "/ai", icon: Sparkles },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

// ── Component ────────────────────────────────────────────────────────────────

interface SidebarProps {
  /** Current user's display name. */
  userName?: string;
}

export function Sidebar(_props?: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]",
      )}
    >
      {/* ── Brand header ──────────────────────────────────────────────── */}
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          N
        </div>
        {!collapsed && (
          <span className="truncate text-sm font-semibold">
            Smart NUB Campus
          </span>
        )}
      </div>

      <Separator />

      {/* ── Main navigation ───────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-0.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* ── Bottom navigation ─────────────────────────────────────────── */}
      <div className="px-3 py-3">
        <ul className="space-y-0.5">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Collapse toggle ───────────────────────────────────────────── */}
      <div className="border-t border-sidebar-border px-3 py-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
