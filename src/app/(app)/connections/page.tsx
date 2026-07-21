import { ConnectionsClient } from "@/components/connections/connections-client";
import { Suspense } from "react";
import {
  getOverviewAction,
  getSuggestionsAction,
} from "@/actions/connection.actions";
import type {
  ConnectionOverview,
  SuggestedPerson,
} from "@/types";

/** Default popular skills surfaced in the right sidebar. */
const DEFAULT_POPULAR_SKILLS = [
  { id: "react", name: "React", slug: "react" },
  { id: "python", name: "Python", slug: "python" },
  { id: "dsa", name: "DSA", slug: "dsa" },
  { id: "java", name: "Java", slug: "java" },
  { id: "node", name: "Node.js", slug: "node" },
  { id: "sql", name: "SQL", slug: "sql" },
];

/**
 * Connections page — Server Component.
 * Loads the initial overview + suggestions, then delegates to the client
 * component which manages tabs, search, filters, and optimistic mutations.
 */
export default async function ConnectionsPage() {
  let overview: ConnectionOverview = {
    totalConnections: 0,
    pending: 0,
    sent: 0,
    favorites: 0,
    blocked: 0,
  };
  let suggestions: SuggestedPerson[] = [];

  try {
    const [overviewRes, suggestionsRes] = await Promise.all([
      getOverviewAction(),
      getSuggestionsAction(),
    ]);
    if (overviewRes.success && overviewRes.data) {
      overview = overviewRes.data as ConnectionOverview;
    }
    if (suggestionsRes.success && suggestionsRes.data) {
      suggestions = suggestionsRes.data as SuggestedPerson[];
    }
  } catch {
    // Client handles empty state gracefully
  }

  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <ConnectionsClient
        initialOverview={overview}
        initialSuggestions={suggestions}
        initialPopularSkills={DEFAULT_POPULAR_SKILLS}
      />
    </Suspense>
  );
}
