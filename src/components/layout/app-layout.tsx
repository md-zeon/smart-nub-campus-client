import { TopNav } from "./top-nav";
import { SkipToContent } from "@/components/skip-to-content";

interface AppLayoutProps {
  children: React.ReactNode;
  /** Current user's display name. */
  userName?: string;
  /** Current user's avatar URL. */
  userImage?: string;
}

/**
 * The main app shell that combines the horizontal TopNav with page content.
 * Used by authenticated route layouts.
 *
 * Includes a skip-to-content link for keyboard/screen-reader users.
 */
export function AppLayout({ children, userName, userImage }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <SkipToContent />
      <TopNav userName={userName} userImage={userImage} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
