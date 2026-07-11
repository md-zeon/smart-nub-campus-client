"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ParsedStudentId } from "@/lib/student-id-parser";
import { accountAction } from "@/actions/account.action";

interface CreateAccountFormProps {
  parsedStudentId: ParsedStudentId;
  defaultName: string;
  defaultStudentId: string;
}

export function CreateAccountForm({
  parsedStudentId,
  defaultName,
  defaultStudentId,
}: CreateAccountFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await accountAction.createAccount(formData.get("password") as string);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Account creation failed.";
      // Let Next.js redirect() bubble up instead of showing to user
      const maybeError = err as { digest?: string } | null;
      if (
        maybeError &&
        typeof maybeError === "object" &&
        maybeError.digest?.startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Student ID - Read only */}
      <div className="space-y-2">
        <Label>Student ID</Label>
        <Input value={defaultStudentId} disabled className="bg-muted/50" />
      </div>

      {/* Full Name - Read only */}
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input value={defaultName} disabled className="bg-muted/50" />
      </div>

      {/* Department - Read only */}
      <div className="space-y-2">
        <Label>Department</Label>
        <Input
          value={parsedStudentId.departmentName}
          disabled
          className="bg-muted/50"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">
          Password <span className="text-destructive">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          name="password"
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters with uppercase, lowercase, and
          numbers.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Account..." : "Create Account & Verify Email"}
      </Button>
    </form>
  );
}
