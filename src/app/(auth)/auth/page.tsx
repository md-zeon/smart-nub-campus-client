import Link from "next/link";
import { ShieldCheck, User, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthInfo from "./_components/AuthInfo";

export default function AuthPage() {
  return (
    <main>
      <div className="grid overflow-hidden rounded-[32px] border bg-[url('/images/nub-campus.png')] dark:bg-[url('/images/nub-campus-night.png')] bg-cover bg-center bg-no-repeat text-card-foreground shadow-xl lg:grid-cols-2">
        {/* Left Section: Branding & Features */}
        <AuthInfo />
        {/* Right Section: Interactive Onboarding Actions */}
        <section className="flex items-center justify-center py-8 px-6">
          <div className="w-full rounded-3xl border bg-card p-10 shadow-lg text-card-foreground">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light dark:bg-primary/20">
                <ShieldCheck className="h-8 w-8 text-brand dark:text-primary" />
              </div>
              <h2 className="mt-5 text-4xl font-bold">Get Started</h2>
              <p className="mt-2 text-muted-foreground">
                Join Smart NUB Campus in a few simple steps
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {/* New Student Card */}
              <Card className="rounded-3xl bg-brand/5 hover:bg-brand/6 border-border">
                <CardHeader className="flex flex-row gap-5 items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-light dark:bg-primary/20">
                    <User className="h-8 w-8 text-brand dark:text-primary" />
                  </div>
                  <div>
                    <CardTitle>I&apos;m a New Student</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                      Verify your student identity for admin approval.
                    </CardDescription>
                    <Button
                      variant="default"
                      nativeButton={false}
                      className="mt-5 group"
                      render={
                        <Link href="/auth/onboarding">
                          Verify My Identity{" "}
                          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300 h-4 w-4" />
                        </Link>
                      }
                    />
                  </div>
                </CardHeader>
              </Card>

              {/* Verified Student Card */}
              <Card className="rounded-3xl bg-success/1 hover:bg-success/4 border-border">
                <CardHeader className="flex flex-row gap-5 items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-success-bg dark:bg-success/20">
                    <ShieldCheck className="h-8 w-8 text-success" />
                  </div>
                  <div>
                    <CardTitle>I&apos;m a Verified Student</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                      Already verified? Login to access the platform.
                    </CardDescription>
                    <Button
                      variant="outline"
                      nativeButton={false}
                      className="mt-5 border border-success px-8 py-5"
                      render={
                        <Link href="/auth/login">
                          Login to My Account{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      }
                    />
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Support Footer */}
            <div className="mt-10 border-t border-border pt-8 flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
                ?
              </div>
              <div>
                <p className="font-medium">Need help getting started?</p>
                <a
                  href="mailto:support@nub.ac.bd"
                  className="text-brand dark:text-primary hover:underline"
                >
                  support@nub.ac.bd
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
