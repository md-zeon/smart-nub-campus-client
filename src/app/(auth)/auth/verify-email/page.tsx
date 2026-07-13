"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/forms/fields/text-field";
import { OTPField } from "@/components/forms/fields/otp-field";
import AuthInfo from "../_components/AuthInfo";
import { authClient } from "@/lib/auth-client";
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "@/schemas/auth/verify-email.schema";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"loading" | "email" | "otp" | "verified">(
    "loading",
  );
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, setValue, getValues, watch, trigger } =
    useForm<VerifyEmailFormValues>({
      resolver: zodResolver(verifyEmailSchema),
      defaultValues: {
        email: "",
        otp: "",
      },
    });

  const otpValue = watch("otp");

  useEffect(() => {
    const storedExpire = sessionStorage.getItem("otp_resend_available_at");
    if (storedExpire) {
      setResendAvailableAt(parseInt(storedExpire, 10));
    }

    const pendingEmail = sessionStorage.getItem("pending_verification_email");
    const source = sessionStorage.getItem("pending_verification_source");

    if (pendingEmail) {
      setEmail(pendingEmail);
      setValue("email", pendingEmail);
      setMode("otp");

      if (source === "login") {
        sessionStorage.removeItem("pending_verification_source");
        setIsPending(true);
        setError(null);

        const sendInitialOtp = async () => {
          try {
            const response = await authClient.emailOtp.sendVerificationOtp({
              email: pendingEmail,
              type: "email-verification",
            });

            if (response.error) {
              if (
                response.error.message
                  ?.toLowerCase()
                  .includes("already verified") ||
                response.error.code === "EMAIL_ALREADY_VERIFIED"
              ) {
                setMode("verified");
              } else {
                setError(
                  response.error.message || "Failed to send code automatically",
                );
              }
            } else {
              startCountdown();
            }
          } catch (err) {
            setError("An unexpected error occurred while sending code.");
          } finally {
            setIsPending(false);
          }
        };

        sendInitialOtp();
      } else {
        // If it's from signup, the backend already sent it, so just start countdown if not already running
        if (!sessionStorage.getItem("otp_resend_available_at")) {
          startCountdown();
        }
      }
    } else {
      setMode("email");
    }
  }, [setValue]);

  useEffect(() => {
    if (!resendAvailableAt) return;

    const calculateRemaining = () =>
      Math.ceil((resendAvailableAt - Date.now()) / 1000);

    let remaining = calculateRemaining();
    if (remaining <= 0) {
      setCountdown(0);
      setResendAvailableAt(null);
      sessionStorage.removeItem("otp_resend_available_at");
      return;
    }

    setCountdown(remaining);

    const interval = setInterval(() => {
      remaining = calculateRemaining();
      if (remaining <= 0) {
        setCountdown(0);
        setResendAvailableAt(null);
        sessionStorage.removeItem("otp_resend_available_at");
        clearInterval(interval);
      } else {
        setCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resendAvailableAt]);

  const startCountdown = () => {
    const expireTime = Date.now() + 30000;
    sessionStorage.setItem("otp_resend_available_at", expireTime.toString());
    setResendAvailableAt(expireTime);
  };

  const handleSendCode = async (data: { email: string }) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "email-verification",
      });
      if (response.error) {
        const errorMsg = response.error.message?.toLowerCase() || "";
        const errorCode = response.error.code;

        if (
          errorMsg.includes("already verified") ||
          errorCode === "EMAIL_ALREADY_VERIFIED"
        ) {
          setMode("verified");
        } else if (
          errorCode === "USER_NOT_FOUND" ||
          errorMsg.includes("not found")
        ) {
          setError(
            "No account found with this email. Please check your email and try again.",
          );
        } else {
          setError(
            response.error.message || "Failed to send verification code",
          );
        }
      } else {
        setEmail(data.email);
        setMode("otp");
        startCountdown();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleVerifyOTP = async (data: VerifyEmailFormValues) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await authClient.emailOtp.verifyEmail({
        email: data.email,
        otp: data.otp,
      });

      if (response.error) {
        // Clear OTP field on error
        setValue("otp", "");
        setError(response.error.message || "Invalid or expired OTP");

        // If expired, let them resend immediately
        if (response.error.code === "OTP_EXPIRED") {
          setCountdown(0);
        }
      } else {
        // Success
        sessionStorage.removeItem("pending_verification_email");
        router.push("/auth/login?verified=true");
      }
    } catch (err) {
      setValue("otp", "");
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setIsPending(true);
    setError(null);
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      if (response.error) {
        setError(response.error.message || "Failed to resend code");
      } else {
        startCountdown();
        setValue("otp", "");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  if (mode === "loading") {
    return (
      <main className="flex min-h-dvh w-dvw items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand dark:text-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="grid overflow-hidden rounded-[32px] border bg-[url('/images/nub-campus.png')] dark:bg-[url('/images/nub-campus-night.png')] bg-cover bg-center bg-no-repeat text-card-foreground shadow-xl lg:grid-cols-2">
        <AuthInfo />

        <section className="flex items-center justify-center py-8 px-6">
          <div className="w-full rounded-3xl border bg-card p-10 shadow-lg text-card-foreground">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light dark:bg-primary/20">
                {mode === "email" ? (
                  <Mail className="h-8 w-8 text-brand dark:text-primary" />
                ) : (
                  <ShieldCheck className="h-8 w-8 text-brand dark:text-primary" />
                )}
              </div>
              <h2 className="mt-5 text-3xl font-bold">Verify Email</h2>
              {mode === "email" ? (
                <p className="mt-2 text-muted-foreground">
                  Enter your email to receive a verification code.
                </p>
              ) : mode === "verified" ? (
                <p className="mt-2 text-muted-foreground">
                  Your email is already verified.
                </p>
              ) : (
                <p className="mt-2 text-muted-foreground">
                  We've sent a verification code to{" "}
                  <span className="font-semibold text-foreground">{email}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {mode === "verified" ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 font-medium text-center">
                  This email is already verified. You can proceed to log in.
                </div>
                <Button
                  className="w-full"
                  render={<Link href="/auth/login">Go to Login</Link>}
                />
              </div>
            ) : mode === "email" ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // TODO: Validate email
                  const isValid = await trigger("email");
                  if (isValid) {
                    handleSendCode({ email: getValues("email") });
                  }
                }}
                className="mt-8 space-y-6"
              >
                <TextField
                  control={control}
                  name="email"
                  label="Email *"
                  placeholder="Enter your account email"
                  disabled={isPending}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit(handleVerifyOTP)}
                className="mt-8 space-y-6"
              >
                <div className="flex justify-center">
                  <OTPField control={control} name="otp" disabled={isPending} />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || otpValue?.length !== 6}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <div className="text-center text-sm">
                  {countdown > 0 ? (
                    <span className="text-muted-foreground">
                      Resend code in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isPending}
                      className="text-brand hover:underline font-medium"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
