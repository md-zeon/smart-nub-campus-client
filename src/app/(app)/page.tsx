import { PageLayout } from "@/components/layout/page-layout";

/**
 * Authenticated home page — placeholder for Phase 13 (Home Page).
 * Renders inside the (app) layout which provides TopNav + user context.
 */
export default function HomePage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          This is your Smart NUB Campus home feed. Content will be built in
          Phase 13.
        </p>
      </div>
    </PageLayout>
  );
}
