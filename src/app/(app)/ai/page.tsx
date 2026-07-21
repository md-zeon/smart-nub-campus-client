/* TODO(AI-PAGE): Known issues to revisit - Phase 18 AI Assistant page. 1) New-chat URL uses /ai?chat=<id> via createNewSession; confirm desired route (some wanted /ai/<uuid> path segment). 2) Chat history title updates from server on first message - verify promptness. 3) Verify send retry-on-not-found + clean URL across refresh/back-forward. 4) Re-check right sidebar (AI Tools removed per request). */
import { Suspense } from "react";
import { aiService } from "@/services/ai.service";
import { PageLayout } from "@/components/layout/page-layout";
import { AISidebar } from "@/components/ai/ai-sidebar";
import { AIRightPanel } from "@/components/ai/ai-right-panel";
import { AIClient } from "@/components/ai/ai-client";
import type { AIChatSession, AIMessage, AIStudyStats } from "@/types/ai.types";

/** Page loading skeleton. */
function PageSkeleton() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    </PageLayout>
  );
}

/**
 * AI Assistant page — Server Component.
 * Fetches the user's chat sessions, study stats, and the current session
 * (when linked via ?chat=) on the server, then renders the interactive
 * AIClient inside a PageLayout with AI sidebars.
 */
export default async function AIPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const activeSessionId =
    typeof params.chat === "string" ? params.chat : undefined;

  let sessions: AIChatSession[] = [];
  let studyStats: AIStudyStats | null = null;
  let activeSession: (AIChatSession & { aiMessages: AIMessage[] }) | null =
    null;
  // When the linked session can't be loaded (deleted / not found), don't
  // seed a dead session id into the client — fall back to a fresh chat.
  let resolvedActiveSessionId: string | null = activeSessionId ?? null;

  try {
    const [sessionsResult, statsResult] = await Promise.all([
      aiService.listSessions({ limit: 50 }),
      aiService.getStudyStats() as Promise<AIStudyStats>,
    ]);

    sessions = (sessionsResult.sessions ?? []) as AIChatSession[];
    studyStats = statsResult ?? null;
  } catch {
    // Client component handles empty state gracefully
  }

  // Load the active session in its own try so a missing session doesn't
  // wipe the rest of the page data.
  if (
    resolvedActiveSessionId &&
    sessions.some((s) => s.id === resolvedActiveSessionId)
  ) {
    try {
      activeSession = (await aiService.getSessionById(
        resolvedActiveSessionId,
      )) as AIChatSession & { aiMessages: AIMessage[] };
    } catch {
      resolvedActiveSessionId = null;
    }
  } else {
    resolvedActiveSessionId = null;
  }

  // Initial messages for the active session (if any)
  const initialMessages: AIMessage[] = activeSession?.aiMessages ?? [];

  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageLayout
        leftSidebar={
          <AISidebar
            sessions={sessions}
            activeSessionId={activeSessionId ?? null}
          />
        }
        rightSidebar={<AIRightPanel studyStats={studyStats} />}
      >
        <AIClient
          initialSessions={sessions}
          initialMessages={initialMessages}
          initialActiveSessionId={resolvedActiveSessionId}
        />
      </PageLayout>
    </Suspense>
  );
}
