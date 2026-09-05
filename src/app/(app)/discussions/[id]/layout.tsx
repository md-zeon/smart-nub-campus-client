import type { Metadata } from "next";
import type { ReactNode } from "react";
import { discussionService } from "@/services/discussion.service";
import { toMetaDescription } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const discussion = await discussionService.getDiscussionById(id);
    const description = toMetaDescription(discussion.content);
    return {
      title: discussion.title,
      description,
      openGraph: {
        title: discussion.title,
        description,
        type: "article",
      },
    };
  } catch {
    return { title: "Discussion" };
  }
}

export default function DiscussionDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}