/**
 * Enum constants mirroring backend Prisma enums exactly.
 * Single source of truth — never hardcode these strings.
 */

export const OnboardingStepValue = {
  VERIFICATION_FORM: "VERIFICATION_FORM",
  ADMIN_REVIEW: "ADMIN_REVIEW",
  ACCOUNT_CREATION: "ACCOUNT_CREATION",
  COMPLETED: "COMPLETED",
} as const;

export type OnboardingStepValue =
  (typeof OnboardingStepValue)[keyof typeof OnboardingStepValue];

export const VerificationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type VerificationStatus =
  (typeof VerificationStatus)[keyof typeof VerificationStatus];

export const UserRole = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const AdmissionSemester = {
  SPRING: "SPRING",
  SUMMER: "SUMMER",
  FALL: "FALL",
} as const;

export type AdmissionSemester =
  (typeof AdmissionSemester)[keyof typeof AdmissionSemester];

export const Department = {
  CSE: "CSE",
  ECSE: "ECSE",
  EEE: "EEE",
  EEEE: "EEEE",
  BBA: "BBA",
  MBA: "MBA",
  ENGLISH: "ENGLISH",
  MAE: "MAE",
  BANGLA: "BANGLA",
  MAB: "MAB",
  LLB: "LLB",
  MPH: "MPH",
  BPH: "BPH",
  ME: "ME",
  CIVIL: "CIVIL",
  BTX: "BTX",
  EBTX: "EBTX",
} as const;

export type Department = (typeof Department)[keyof typeof Department];

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
  PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];
