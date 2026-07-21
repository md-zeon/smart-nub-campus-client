import type { Metadata } from "next";
import { HeroBanner } from "@/components/home/hero-banner";
import { QuickAccess } from "@/components/home/quick-access";
import { TrendingResources } from "@/components/home/trending-resources";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { TopContributors } from "@/components/home/top-contributors";
import { resourceService } from "@/services/resource.service";
import { gamificationService } from "@/services/gamification.service";
import { eventService } from "@/services/event.service";

export const metadata: Metadata = {
  title: "Home | Smart NUB Campus",
  description:
    "Smart NUB Campus dashboard — collaborate, learn, share resources and grow together at North South University.",
  openGraph: {
    title: "Smart NUB Campus",
    description:
      "The exclusive academic platform for North South University students.",
    type: "website",
  },
};

/**
 * Home page — the first thing users see after login.
 * Full-width layout with no PageLayout sidebar wrapper.
 * Fetches all section data server-side using cached services and passes it
 * down to presentational components (no client-side fetching).
 */
export default async function HomePage() {
  const [trendingResult, leaderboardResult, eventsResult] = await Promise.all([
    resourceService.listResources({ sort: "popular", limit: 3 }).catch(() => ({ data: [] })),
    gamificationService.getLeaderboard(1, 3).catch(() => ({ data: [] })),
    eventService.listEvents({ status: "UPCOMING", limit: 3 }).catch(() => ({ data: [] })),
  ]);

  const trendingResources = trendingResult.data ?? [];
  const topContributors = leaderboardResult.data ?? [];
  const upcomingEvents = eventsResult.data ?? [];

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
          <TrendingResources resources={trendingResources} />

          {/* ── Right column: Events + Contributors ───────────────── */}
          <div className="space-y-8">
            <UpcomingEvents events={upcomingEvents} />
            <TopContributors contributors={topContributors} />
          </div>
        </div>
      </section>
    </div>
  );
}
