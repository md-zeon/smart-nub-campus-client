"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAccount } from "@/actions/account.action";
import { parseStudentId } from "@/lib/student-id-parser";

interface CreateAccountFormProps {
  defaultName: string;
  defaultStudentId: string;
  defaultEmail: string;
}

export function CreateAccountForm({
  defaultName,
  defaultStudentId,
  defaultEmail,
}: CreateAccountFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const studentIdInfo = parseStudentId(defaultStudentId);

  const handleSubmit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createAccount(formData.get("password") as string);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Account creation failed.";
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
          value={studentIdInfo.data?.department.fullName}
          disabled
          className="bg-muted/50"
        />
      </div>

      {/* Admission Year - Read only */}
      <div className="space-y-2">
        <Label>Admission Year</Label>
        <Input
          value={studentIdInfo.data?.admissionYear}
          disabled
          className="bg-muted/50"
        />
      </div>

      {/* Email - Read only */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={defaultEmail} disabled className="bg-muted/50" />
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
