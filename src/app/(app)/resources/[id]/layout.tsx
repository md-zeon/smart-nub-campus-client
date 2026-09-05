import type { Metadata } from "next";
import type { ReactNode } from "react";
import { resourceService } from "@/services/resource.service";
import { toMetaDescription } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const resource = await resourceService.getResourceById(id);
    const description = toMetaDescription(resource.description);
    return {
      title: resource.title,
      description,
      openGraph: {
        title: resource.title,
        description,
        type: "article",
      },
    };
  } catch {
    return { title: "Resource" };
  }
}

export default function ResourceDetailLayout({ children }: { children: ReactNode }) {
  return children;
}