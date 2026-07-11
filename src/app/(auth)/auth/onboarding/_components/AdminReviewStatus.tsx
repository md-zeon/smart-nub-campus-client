"use client";

import { ShieldCheckIcon } from "@/components/ui/icons/shield-check";
import { ExclamationCircleIcon } from "@/components/ui/icons/exclamation-circle";
import { CheckCircleIcon } from "@/components/ui/icons/check-circle";
import { XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VerificationStatus } from "@/constants/enums";

interface AdminReviewStatusProps {
  status: VerificationStatus;
  note?: string | null;
  onRetry?: () => void;
  onContinue?: () => void;
}

export function AdminReviewStatus({
  status,
  note,
  onRetry,
  onContinue,
}: AdminReviewStatusProps) {
  if (status === "PENDING") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="relative">
          <ShieldCheckIcon className="text-muted-foreground" size={64} />
          <span className="absolute -bottom-1 -right-1 flex size-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex size-5 rounded-full bg-brand" />
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Verification in Progress
          </h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Your submitted documents are currently being reviewed by the
            administration. This process typically takes 1-2 business days.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border bg-muted/50 p-4 text-left text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex size-2 rounded-full bg-amber-500" />
            <span>Status: Pending Review</span>
          </div>
          <p className="text-xs text-muted-foreground">
            You will be able to proceed once an admin reviews your submission.
            Check back later or wait for a notification.
          </p>
        </div>
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <CheckCircleIcon className="text-success" size={64} />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Verification Approved!
          </h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Your identity has been verified successfully. You can now proceed to
            create your account.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-success/5 p-4 text-sm text-success">
          <CheckCircleIcon size={20} />
          <span className="font-medium">Approved</span>
        </div>
        {onContinue && (
          <Button onClick={onContinue} variant="default">
            Continue to Next Step
          </Button>
        )}
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <XCircleIcon className="size-16 text-destructive" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Verification Rejected
          </h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Unfortunately, your verification request was not approved. Please
            review the admin note below and try again.
          </p>
        </div>
        {note && (
          <div className="w-full max-w-md rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-left">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
              <ExclamationCircleIcon size={18} />
              <span>Admin Note</span>
            </div>
            <p className="text-sm text-muted-foreground">{note}</p>
          </div>
        )}
        {onRetry && (
          <Button onClick={onRetry} variant="destructive">
            Submit Again
          </Button>
        )}
      </div>
    );
  }

  return null;
}
