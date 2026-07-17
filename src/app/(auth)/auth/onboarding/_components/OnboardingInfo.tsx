"use client";

import { AcademicCapIcon } from "@/components/ui/icons/academic-cap";
import { InformationCircleIcon } from "@/components/ui/icons/information-circle";
import { ShieldCheckIcon } from "@/components/ui/icons/shield-check";
import { SparklesIcon } from "@/components/ui/icons/sparkles";
import { CheckCircleIcon } from "@/components/ui/icons/check-circle";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  Mail,
  ShieldCheck,
  Users2,
  XCircle,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { OnboardingStepValue, VerificationStatus } from "@/constants/enums";

type Accent = "brand" | "warning" | "success" | "danger";

type AccentStyles = {
  bg: string;
  text: string;
  badgeBg: string;
};

interface StepInfoItem {
  icon: React.ElementType;
  title: string;
  description: string;
  variant?: Accent;
}

interface StepInfo {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: Accent;
  sequential?: boolean;
  items: StepInfoItem[];
  badge: {
    title: string;
    description: string;
  };
}

const ICON_SIZE = 32;

const STEP_INFO: Record<OnboardingStepValue, StepInfo> = {
  [OnboardingStepValue.VERIFICATION_FORM]: {
    icon: <ShieldCheckIcon className="text-brand" size={ICON_SIZE} />,
    title: "Verify Your Student Identity",
    description:
      "To ensure a safe and trusted community, we verify every student before granting access to Smart NUB Campus",
    accent: "brand",
    sequential: true,
    items: [
      {
        icon: Users2,
        title: "Secure & exclusive",
        description: "Only verified NUB students get in",
      },
      {
        icon: ShieldCheck,
        title: "Your data is safe",
        description:
          "Used only for verification, never shared with anyone else",
        variant: "success",
      },
      {
        icon: Clock,
        title: "Quick approval",
        description:
          "Our admin team reviews submissions within 1-2 working days",
      },
    ],
    badge: {
      title: "Accurate information required",
      description:
        "Double-check your details before submitting. Mistakes or mismatches can delay or block approval.",
    },
  },
  [OnboardingStepValue.ADMIN_REVIEW]: {
    icon: <Clock className="text-warning" size={ICON_SIZE} />,
    title: "Verification in Progress",
    description:
      "Thanks — your information is in the queue. Our admin team is confirming your student identity now, and you'll get an email the moment it's done.",
    accent: "warning",
    sequential: true,
    items: [
      {
        icon: Clock,
        title: "Admin review",
        description: "Your submission and ID card are being checked",
      },
      {
        icon: Mail,
        title: "Email notification",
        description: "You'll hear from us as soon as a decision is made",
      },
      {
        icon: ShieldCheck,
        title: "Create your account",
        description: "Once approved, you're straight into account setup",
      },
    ],
    badge: {
      title: "Review in progress",
      description:
        "Sit tight — no action needed. We'll email you the moment your review is complete.",
    },
  },
  [OnboardingStepValue.ACCOUNT_CREATION]: {
    icon: <AcademicCapIcon className="text-brand" size={ICON_SIZE} />,
    title: "Create Your Account",
    description: "Set up your Smart NUB Campus account credentials.",
    accent: "brand",
    items: [
      {
        icon: CheckCircle,
        title: "Your info is ready",
        description:
          "Student ID, name, department, and email are pre-filled from verification",
        variant: "success",
      },
      {
        icon: ShieldCheck,
        title: "Set your password",
        description:
          "Choose a strong password with at least 8 characters, including uppercase, lowercase, and numbers",
      },
      {
        icon: Mail,
        title: "Email verification next",
        description:
          "After creating your account, verify your email to complete setup",
      },
    ],
    badge: {
      title: "Account security",
      description:
        "Choose a strong, unique password. Your NUB email is used for recovery and verification.",
    },
  },
  [OnboardingStepValue.VERIFY_EMAIL]: {
    icon: <Mail className="text-brand" size={ICON_SIZE} />,
    title: "Verify Your Email",
    description:
      "We've sent a verification code to your email. Enter it below to confirm your identity and activate your account.",
    accent: "brand",
    items: [
      {
        icon: Mail,
        title: "Check your inbox",
        description: "A 6-digit code was sent to your registered email",
      },
      {
        icon: Clock,
        title: "Code expires in 5 minutes",
        description: "Enter the code before it expires, or request a new one",
      },
      {
        icon: ShieldCheck,
        title: "One-time verification",
        description: "Once verified, you'll have full access to your account",
        variant: "success",
      },
    ],
    badge: {
      title: "Can't find the email?",
      description:
        "Check your spam/junk folder, or click 'Resend Code' to get a new verification code.",
    },
  },
  [OnboardingStepValue.COMPLETED]: {
    icon: <SparklesIcon className="text-brand" size={ICON_SIZE} />,
    title: "Onboarding Complete!",
    description:
      "Your account has been created successfully. Welcome to Smart NUB Campus!",
    accent: "success",
    items: [],
    badge: {
      title: "Welcome aboard!",
      description:
        "Your account is active — head to the dashboard to get started.",
    },
  },
};

const ADMIN_REVIEW_STATUS_INFO: Record<VerificationStatus, StepInfo> = {
  PENDING: STEP_INFO[OnboardingStepValue.ADMIN_REVIEW],
  APPROVED: {
    icon: <CheckCircleIcon className="text-success" size={ICON_SIZE} />,
    title: "Verification Approved!",
    description:
      "Your identity is confirmed. You're clear to create your account and start using Smart NUB Campus.",
    accent: "success",
    sequential: true,
    items: [
      {
        icon: CheckCircle,
        title: "Identity verified",
        description: "Your student identity has been confirmed",
        variant: "success",
      },
      {
        icon: ShieldCheck,
        title: "Account ready",
        description: "You can now create your Smart NUB Campus account",
        variant: "success",
      },
      {
        icon: AcademicCapIcon,
        title: "Get started",
        description: "Access campus features and connect with peers",
        variant: "success",
      },
    ],
    badge: {
      title: "Next step ready",
      description:
        "You're verified! Click 'Continue to Next Step' to create your account.",
    },
  },
  REJECTED: {
    icon: <XCircle className="text-danger" size={ICON_SIZE} />,
    title: "Verification Rejected",
    description:
      "Your verification wasn't approved this time. Check the admin's note below, then resubmit with the correct details.",
    accent: "danger",
    items: [
      {
        icon: XCircle,
        title: "Review the feedback",
        description: "See the admin's note to understand what needs fixing",
        variant: "danger",
      },
      {
        icon: ShieldCheck,
        title: "Correct & resubmit",
        description: "Fix the flagged issues and send it in again",
      },
      {
        icon: Mail,
        title: "Need help?",
        description: "Reach out to support if anything's unclear",
      },
    ],
    badge: {
      title: "Resubmission required",
      description:
        "Review the admin's note, correct the issue, and submit your information again.",
    },
  },
};

const ACCENT_STYLES: Record<Accent, AccentStyles> = {
  brand: {
    bg: "bg-brand-light dark:bg-primary/20",
    text: "text-brand dark:text-primary",
    badgeBg: "bg-primary/10",
  },
  warning: {
    bg: "bg-warning/10 dark:bg-warning/20",
    text: "text-warning",
    badgeBg: "bg-warning/10",
  },
  success: {
    bg: "bg-success/10 dark:bg-success/20",
    text: "text-success",
    badgeBg: "bg-success/10",
  },
  danger: {
    bg: "bg-danger/10 dark:bg-danger/20",
    text: "text-danger",
    badgeBg: "bg-danger/10",
  },
};

interface OnboardingInfoProps {
  step: OnboardingStepValue;
  verificationStatus?: VerificationStatus;
}

export function OnboardingInfo({
  step,
  verificationStatus,
}: OnboardingInfoProps) {
  const info =
    step === OnboardingStepValue.ADMIN_REVIEW && verificationStatus
      ? ADMIN_REVIEW_STATUS_INFO[verificationStatus]
      : STEP_INFO[step];

  const headerAccent = ACCENT_STYLES[info.accent];
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      key={`${step}-${verificationStatus ?? "default"}`}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
      className="flex flex-col h-full p-2 sm:p-4"
    >
      <div className="flex-1 max-w-xl">
        <div
          className={cn(
            "flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full shrink-0 ring-4 ring-white/40 dark:ring-white/5",
            headerAccent.bg,
          )}
        >
          {info.icon}
        </div>
        <h1 className="mt-3 sm:mt-4 text-2xl sm:text-4xl font-bold max-w-xs tracking-tight leading-tight">
          {info.title}
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {info.description}
        </p>

        {info.items.length > 0 && (
          <div className="relative mt-6 sm:mt-12 space-y-4 sm:space-y-6 max-w-sm">
            {info.sequential && (
              <div
                aria-hidden
                className="absolute left-5 sm:left-6 top-5 sm:top-6 bottom-5 sm:bottom-6 w-px bg-border"
              />
            )}
            {info.items.map(
              ({ icon: Icon, title: label, description, variant }, i) => {
                const itemAccent = ACCENT_STYLES[variant ?? "brand"];
                return (
                  <div key={i} className="relative flex items-center gap-3 sm:gap-4">
                    <div
                      className={cn(
                        "relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full",
                        itemAccent.bg,
                      )}
                    >
                      <Icon className={cn("size-4 sm:size-5", itemAccent.text)} />
                    </div>
                    <div>
                      <span className="font-medium text-sm sm:text-base">{label}</span>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Important Badge */}
      <div
        className={cn(
          "flex w-full sm:w-sm md:w-md gap-3 mt-6 sm:mt-12 rounded-2xl p-4 sm:p-5",
          headerAccent.badgeBg,
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full shrink-0",
            headerAccent.bg,
          )}
        >
          <InformationCircleIcon className={headerAccent.text} />
        </div>
        <div>
          <h3 className="font-bold text-sm sm:text-base">{info.badge.title}</h3>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
            {info.badge.description}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
