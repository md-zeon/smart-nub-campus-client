import type { Metadata } from "next";
import type { ReactNode } from "react";
import { qaService } from "@/services/qa.service";
import { toMetaDescription } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const question = await qaService.getQuestionById(id);
    const description = toMetaDescription(question.content);
    return {
      title: question.title,
      description,
      openGraph: {
        title: question.title,
        description,
        type: "article",
      },
    };
  } catch {
    return { title: "Question" };
  }
}

export default function QuestionDetailLayout({ children }: { children: ReactNode }) {
  return children;
}