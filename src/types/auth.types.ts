import { Gender, UserRole, UserStatus } from "@/constants/enums";

export interface SignInResponse {
  data: {
    redirect: boolean;
    token: string;
    user: {
      createdAt: Date;
      deletedAt: Date | null;
      email: string;
      emailVerified: boolean;
      gender: Gender | null;
      id: string;
      image: string | null;
      isDeleted: boolean;
      name: string;
      role: UserRole;
      status: UserStatus;
      updatedAt: Date;
    };
  } | null;
  error: {
    code: string;
    message: string;
    status: number;
    statusText: string;
  } | null;
}
