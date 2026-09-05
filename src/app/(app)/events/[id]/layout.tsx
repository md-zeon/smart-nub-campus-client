import type { Metadata } from "next";
import type { ReactNode } from "react";
import { eventService } from "@/services/event.service";
import { toMetaDescription } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const event = await eventService.getEventById(id);
    const description = toMetaDescription(event.description);
    return {
      title: event.title,
      description,
      openGraph: {
        title: event.title,
        description,
        type: "article",
        ...(event.imageUrl
          ? { images: [{ url: event.imageUrl, alt: event.title }] }
          : {}),
      },
    };
  } catch {
    return { title: "Event" };
  }
}

export default function EventDetailLayout({ children }: { children: ReactNode }) {
  return children;
}