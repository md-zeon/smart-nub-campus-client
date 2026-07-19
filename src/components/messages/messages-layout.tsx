import { cn } from "@/lib/utils";

interface MessagesLayoutProps {
  /** Column 1: New button, tabs, groups list, stay-connected. */
  sidebar: React.ReactNode;
  /** Column 2: conversation list. */
  conversationList: React.ReactNode;
  /** Column 3: active chat thread. */
  chat: React.ReactNode;
  /** Column 4 (toggleable): profile panel. */
  profile: React.ReactNode;
  /** Whether Column 4 is currently visible. */
  profileOpen: boolean;
  className?: string;
}

/**
 * Custom 4-column layout for the Messages page. Deliberately does NOT use the
 * shared PageLayout — messaging needs a bespoke multi-panel shell.
 *
 * Layout (desktop):
 *   [240px sidebar] [320px conversation list] [flex-1 chat] [300px profile?]
 * On mobile the panels stack / collapse into the conversation list.
 */
export function MessagesLayout({
  sidebar,
  conversationList,
  chat,
  profile,
  profileOpen,
  className,
}: MessagesLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto flex h-[calc(100vh-4rem)] w-full max-w-360 gap-0 overflow-hidden",
        className,
      )}
    >
      {/* Column 1 — Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-background md:block">
        {sidebar}
      </aside>

      {/* Column 2 — Conversation list */}
      <section className="hidden w-80 shrink-0 border-r bg-background sm:block">
        {conversationList}
      </section>

      {/* Column 3 — Active chat */}
      <section className="min-w-0 flex-1 bg-background">{chat}</section>

      {/* Column 4 — Profile panel (toggleable) */}
      {profileOpen && (
        <aside className="hidden w-72 shrink-0 border-l bg-background lg:block">
          {profile}
        </aside>
      )}
    </div>
  );
}
