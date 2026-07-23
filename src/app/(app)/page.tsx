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
  const [trendingResult, leaderboardResult, eventsResult] = await Promise.allSettled([
    resourceService.listResources({ sort: "popular", limit: 3 }),
    gamificationService.getLeaderboard(1, 3),
    eventService.listEvents({ status: "UPCOMING", limit: 3 }),
  ]);

  const trendingResources =
    trendingResult.status === "fulfilled" ? (trendingResult.value.data ?? []) : [];
  const topContributors =
    leaderboardResult.status === "fulfilled" ? (leaderboardResult.value.data ?? []) : [];
  const upcomingEvents =
    eventsResult.status === "fulfilled" ? (eventsResult.value.data ?? []) : [];

  const trendingError = trendingResult.status === "rejected";
  const contributorsError = leaderboardResult.status === "rejected";
  const eventsError = eventsResult.status === "rejected";

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
          <TrendingResources resources={trendingResources} error={trendingError} />

          {/* ── Right column: Events + Contributors ───────────────── */}
          <div className="space-y-8">
            <UpcomingEvents events={upcomingEvents} error={eventsError} />
            <TopContributors contributors={topContributors} error={contributorsError} />
          </div>
        </div>
      </section>
    </div>
  );
}
