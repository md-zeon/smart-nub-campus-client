"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/forms/fields/text-field";
import { PasswordField } from "@/components/forms/fields/password-field";
import AuthInfo from "../_components/AuthInfo";
import isStudentId from "@/lib/isStudentId";
import { authClient } from "@/lib/auth-client";
import { getEmailByStudentId } from "@/actions/auth.action";
import { loginSchema, type LoginFormValues } from "@/schemas/auth/login.schema";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<{
    success: boolean;
    error: string | null;
  }>({
    success: true,
    error: null,
  });

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    setState({ success: false, error: null });

    try {
      const isStudentIdGiven = isStudentId(data.identifier);
      let email = data.identifier;

      if (isStudentIdGiven) {
        email = await getEmailByStudentId(data.identifier);
      }

      const response = await authClient.signIn.email({
        email,
        password: data.password,
      });

      if (response.error) {
        setState({
          success: false,
          error: response.error.message!,
        });
        return;
      }

      if (!response.data || !response.data.user) {
        setState({
          success: false,
          error: "Invalid student ID or Password. Please try again.",
        });
        return;
      }

      setState({ success: true, error: null });
    } catch (error) {
      setState({
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      console.error("Login error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main>
      <div className="grid overflow-hidden rounded-[32px] border bg-[url('/images/nub-campus.png')] dark:bg-[url('/images/nub-campus-night.png')] bg-cover bg-center bg-no-repeat text-card-foreground shadow-xl lg:grid-cols-2">
        {/* Left Section: Branding & Features */}
        <AuthInfo />

        {/* Right Section: Login Form */}
        <section className="flex items-center justify-center py-8 px-6">
          <div className="w-full rounded-3xl border bg-card p-10 shadow-lg text-card-foreground">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light dark:bg-primary/20">
                <ShieldCheck className="h-8 w-8 text-brand dark:text-primary" />
              </div>
              <h2 className="mt-5 text-3xl font-bold">Welcome Back</h2>
              <p className="mt-2 text-muted-foreground">
                Login to access your Smart NUB Campus account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              {state.error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {state.error}
                </div>
              )}

              <div className="space-y-4">
                <TextField
                  control={control}
                  name="identifier"
                  label={
                    <>
                      Student ID or Email{" "}
                      <span className="text-destructive">*</span>
                    </>
                  }
                  placeholder="Enter your student ID or email"
                  disabled={isPending}
                />

                <PasswordField
                  control={control}
                  name="password"
                  label="Password *"
                  disabled={isPending}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-brand hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
