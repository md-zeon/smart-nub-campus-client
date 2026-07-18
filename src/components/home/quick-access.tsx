import Link from "next/link";
import {
  BookOpen,
  Users,
  UserPlus,
  MessageSquare,
  HelpCircle,
  Bot,
} from "lucide-react";

const shortcuts = [
  { label: "Resources", icon: BookOpen, href: "/resources" },
  { label: "Teams", icon: Users, href: "/teams" },
  { label: "Network", icon: UserPlus, href: "/connections" },
  { label: "Discussions", icon: MessageSquare, href: "/discussions" },
  { label: "Q&A", icon: HelpCircle, href: "/qa" },
  { label: "AI Assistant", icon: Bot, href: "/ai" },
] as const;

/** Horizontal row of shortcut cards linking to main platform features. */
export function QuickAccess() {
  return (
    <section className="mx-auto max-w-360 px-4 py-8 sm:px-6">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {shortcuts.map(({ label, icon: Icon, href }) => (
          <Link
            key={href}
            href={href}
            className="flex min-w-[120px] flex-col items-center gap-2 rounded-xl border bg-card p-4 text-card-foreground shadow-xs ring-1 ring-foreground/10 transition-all hover:scale-[1.03] hover:shadow-md"
          >
            <Icon className="size-6 text-primary" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
