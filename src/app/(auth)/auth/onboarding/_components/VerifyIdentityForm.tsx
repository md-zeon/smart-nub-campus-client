"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDaysIcon } from "@/components/ui/icons/calendar-days";
import { IdCardIcon } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { cn } from "@/lib/utils";
import { parseStudentId } from "@/lib/student-id-parser";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  dateOfBirth: string;
  studentId: string;
  idCardImage: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  studentId?: string;
  idCardImage?: string;
}

interface VerifyIdentityFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export function VerifyIdentityForm({
  onSubmit,
  isSubmitting,
}: VerifyIdentityFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    dateOfBirth: "",
    studentId: "",
    idCardImage: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 16) {
        newErrors.dateOfBirth = "You must be at least 16 years old";
      }
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else {
      const parsed = parseStudentId(formData.studentId);
      if (!parsed.isValid) {
        newErrors.studentId = parsed.error || "Invalid student ID format";
      }
    }

    if (!formData.idCardImage) {
      newErrors.idCardImage = "Please upload your student ID card";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (url: string, _file: File | null) => {
    updateField("idCardImage", url);
    if (errors.idCardImage) {
      setErrors((prev) => ({ ...prev, idCardImage: undefined }));
    }
  };

  const parsedStudentId = formData.studentId
    ? parseStudentId(formData.studentId)
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
              aria-invalid={!!errors.dateOfBirth}
              className={cn(
                "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
              )}
            />
            <CalendarDaysIcon
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Student ID */}
        <div className="space-y-2">
          <Label htmlFor="studentId">
            Student ID <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="studentId"
              placeholder="Enter your 11-digit student ID"
              value={formData.studentId}
              onChange={(e) => updateField("studentId", e.target.value)}
              aria-invalid={!!errors.studentId}
              className="pl-10"
              maxLength={11}
            />
            <IdCardIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.studentId && (
            <p className="text-xs text-destructive">{errors.studentId}</p>
          )}
          {parsedStudentId && parsedStudentId.isValid && (
            <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
              <p>
                <span className="font-medium text-foreground">Department:</span>{" "}
                {parsedStudentId.departmentName}
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Admission Year:
                </span>{" "}
                {parsedStudentId.admissionYear}
              </p>
              <p>
                <span className="font-medium text-foreground">Intake:</span>{" "}
                {parsedStudentId.intakeName}
              </p>
              <p>
                <span className="font-medium text-foreground">Student #:</span>{" "}
                {parsedStudentId.studentNumber.toString().padStart(4, "0")}
              </p>
            </div>
          )}
        </div>

        {/* ID Card Upload */}
        <div className="space-y-2">
          <Label>
            Student ID Card <span className="text-destructive">*</span>
          </Label>
          <ImageUpload
            value={formData.idCardImage}
            onChange={handleImageChange}
            error={errors.idCardImage}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit for Verification"}
      </Button>
    </form>
  );
}
