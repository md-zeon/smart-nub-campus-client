import React from "react";

// ── URL Detection ────────────────────────────────────────────────────────────

/**
 * Regex pattern to detect URLs in text.
 * Matches http/https URLs and www. URLs without protocol.
 */
const URL_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*[a-zA-Z0-9()@:%_+.~#?&/=])?|(?:www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*[a-zA-Z0-9()@:%_+.~#?&/=])?/gi;

/**
 * Internal domains that match the Smart NUB Campus platform.
 */
const INTERNAL_DOMAINS = [
  "smartnubcampus.com",
  "smart-nub-campus-client.vercel.app",
  "localhost:3000",
];

// ── Types ────────────────────────────────────────────────────────────────────

export interface DetectedLink {
  url: string;
  isInternal: boolean;
  start: number;
  end: number;
}

// ── URL Utilities ────────────────────────────────────────────────────────────

/**
 * Check if a URL is an internal link (Smart NUB Campus).
 */
export function isInternalLink(url: string): boolean {
  try {
    const parsed = new URL(url);
    return INTERNAL_DOMAINS.some(
      (domain) =>
        parsed.hostname === domain ||
        parsed.hostname === domain.replace(/^https?:\/\//, ""),
    );
  } catch {
    return false;
  }
}

/**
 * Normalize a URL by adding https:// if missing.
 */
export function normalizeUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("www.")) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Extract domain name from URL for display.
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Get display text for a URL (truncate if too long).
 */
export function getUrlDisplayText(url: string, maxLength = 50): string {
  const domain = extractDomain(url);
  const path = new URL(url).pathname;

  if (domain.length + path.length <= maxLength) {
    return domain + path;
  }

  return domain + path.slice(0, maxLength - domain.length - 3) + "...";
}

// ── Content Parsing ──────────────────────────────────────────────────────────

/**
 * Extract all links from text content.
 */
export function extractLinks(text: string): DetectedLink[] {
  const links: DetectedLink[] = [];
  let match;

  const regex = new RegExp(URL_REGEX.source, URL_REGEX.flags);
  while ((match = regex.exec(text)) !== null) {
    links.push({
      url: normalizeUrl(match[0]),
      isInternal: isInternalLink(match[0]),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return links;
}

// ── Search Highlight + Link Rendering ────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(
  text: string,
  query: string,
  activeMatchGlobalIndex: number,
  firstMatchIndexInMessage: number,
): React.ReactNode[] {
  if (!query) return [text];
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  const parts = text.split(regex);
  let matchCount = 0;
  return parts.map((part, i) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      const localIndex = matchCount;
      const globalIndex = firstMatchIndexInMessage + localIndex;
      const isActive = globalIndex === activeMatchGlobalIndex;
      matchCount++;
      return React.createElement(
        "mark",
        {
          key: i,
          className: `rounded-sm px-0.5 font-semibold ${
            isActive
              ? "bg-amber-300 text-amber-900 dark:bg-amber-600 dark:text-amber-100"
              : "bg-yellow-200 text-yellow-900 dark:bg-yellow-700/50 dark:text-yellow-200"
          }`,
        },
        part,
      );
    }
    return part;
  });
}

/**
 * Render message content with clickable links and optional search highlight.
 * Returns an array of React nodes that can be rendered in a paragraph.
 */
export function renderMessageWithLinks(
  text: string,
  searchHighlight?: {
    query: string;
    activeMatchGlobalIndex: number;
    firstMatchIndexInMessage: number;
  } | null,
): React.ReactNode[] {
  const links = extractLinks(text);

  if (links.length === 0) {
    // No links, just render with search highlight
    if (searchHighlight) {
      return highlightText(
        text,
        searchHighlight.query,
        searchHighlight.activeMatchGlobalIndex,
        searchHighlight.firstMatchIndexInMessage,
      );
    }
    return [text];
  }

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  links.forEach((link, index) => {
    // Add text before the link
    if (link.start > lastIndex) {
      const textBefore = text.slice(lastIndex, link.start);
      if (searchHighlight) {
        nodes.push(
          ...highlightText(
            textBefore,
            searchHighlight.query,
            searchHighlight.activeMatchGlobalIndex,
            searchHighlight.firstMatchIndexInMessage,
          ),
        );
      } else {
        nodes.push(textBefore);
      }
    }

    // Add the link
    nodes.push(
      React.createElement(
        "a",
        {
          key: `link-${index}`,
          href: link.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className:
            "text-blue-600 underline decoration-blue-600/40 transition-colors hover:text-blue-800 hover:decoration-blue-800/60 dark:text-blue-400 dark:hover:text-blue-300",
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
          },
        },
        extractDomain(link.url),
      ),
    );

    lastIndex = link.end;
  });

  // Add remaining text after the last link
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex);
    if (searchHighlight) {
      nodes.push(
        ...highlightText(
          textAfter,
          searchHighlight.query,
          searchHighlight.activeMatchGlobalIndex,
          searchHighlight.firstMatchIndexInMessage,
        ),
      );
    } else {
      nodes.push(textAfter);
    }
  }

  return nodes;
}
