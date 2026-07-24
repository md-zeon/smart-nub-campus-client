import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProfile } from "@/actions/profile.actions";
import { ProfileClient } from "@/components/profile/profile-client";
import { UserProfileSkeleton } from "@/components/skeletons/user-profile-skeleton";
import type { ProfileUser } from "@/types/profile.types";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const result = await getPublicProfile(id);
    if (result.success && result.data) {
      const user = result.data as ProfileUser;
      return { title: `${user.name} — Profile` };
    }
  } catch {
    // Ignore
  }
  return { title: "Profile" };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const result = await getPublicProfile(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <ProfileClient profileData={result.data as ProfileUser} />
    </Suspense>
  );
}
