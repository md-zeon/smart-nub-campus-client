// ── Profile ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  userId: string;
  bio: string | null;
  coverImage: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  websiteUrl: string | null;
  location: string | null;
  phoneNumber: string | null;
  currentSemester: number | null;
  batchYear: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUser {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  student: {
    studentId: string;
    department: string;
    admissionYear: number;
    admissionSemester: string;
  } | null;
  profile: UserProfile | null;
}

export interface UpdateProfilePayload {
  bio?: string;
  coverImage?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  location?: string;
  phoneNumber?: string;
  currentSemester?: number;
  batchYear?: number;
}
