import { TopNav } from "./top-nav";

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
 * @example
 * ```tsx
 * <AppLayout userName={user.name} userImage={user.image}>
 *   <HomePage />
 * </AppLayout>
 * ```
 */
export function AppLayout({ children, userName, userImage }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <TopNav userName={userName} userImage={userImage} />
      <main>{children}</main>
    </div>
  );
}
