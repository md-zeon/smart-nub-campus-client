import { HeroBanner } from "@/components/home/hero-banner";
import { QuickAccess } from "@/components/home/quick-access";
import { TrendingResources } from "@/components/home/trending-resources";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { TopContributors } from "@/components/home/top-contributors";

/**
 * Home page — the first thing users see after login.
 * Full-width layout with no PageLayout sidebar wrapper.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <HeroBanner />

      {/* ── Quick Access Icons ───────────────────────────────────── */}
      <QuickAccess />

      {/* ── Two-Column Content Area ──────────────────────────────── */}
      <section className="mx-auto max-w-360 px-4 pb-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* ── Left column: Trending Resources ───────────────────── */}
          <TrendingResources />

          {/* ── Right column: Events + Contributors ───────────────── */}
          <div className="space-y-8">
            <UpcomingEvents />
            <TopContributors />
          </div>
        </div>
      </section>
    </div>
  );
}
