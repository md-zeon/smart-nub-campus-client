import Link from "next/link";
import {
  ShieldCheck,
  User,
  Users,
  Users2,
  BookOpen,
  MessageCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GetStartedPage() {
  return (
    <main className="p-6">
      <div className="grid overflow-hidden rounded-[32px] border bg-[url('/images/nub-campus.png')] dark:bg-[url('/images/nub-campus-night.png')] bg-cover bg-center bg-no-repeat text-card-foreground shadow-xl lg:grid-cols-2">
        {/* Left Section: Branding & Features */}
        <section className="relative flex min-h-205 flex-col overflow-hidden p-12">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl font-medium">Welcome to</h2>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Smart NUB Campus
            </h1>
            <p className="mt-4 text-xl font-medium text-brand-hover dark:text-primary/90">
              Your Campus. Your Community. Your Future.
            </p>
            <p className="mt-8 text-muted-foreground">
              Smart NUB Campus is an exclusive platform for Northern University
              Bangladesh students. Collaborate, learn, share resources and grow
              together in a trusted academic environment.
            </p>

            <div className="mt-10 space-y-2">
              {[
                [Users2, "Connect with verified NUB students"],
                [BookOpen, "Access notes, resources & discussions"],
                [MessageCircle, "Ask questions & get expert help"],
                [Users, "Find teammates & work on projects"],
              ].map(([Icon, label], i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light dark:bg-primary/20">
                    <Icon className="h-5 w-5 text-brand dark:text-primary" />
                  </div>
                  <span className="font-medium">{label as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="absolute bottom-10 left-10 z-20 flex sm:w-sm md:w-md lg:w-lg gap-3 rounded-2xl border bg-card/85 p-5 shadow-xl backdrop-blur text-card-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light dark:bg-primary/20">
              <Shield className="h-6 w-6 text-brand dark:text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Secure. Verified. Trusted.</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Only Northern University Bangladesh students can join Smart NUB
                Campus.
              </p>
            </div>
          </div>
        </section>

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
                      className="mt-5 rounded-xl px-8 py-5 bg-brand text-white hover:bg-brand/90"
                      render={<Link href="/verify">Verify My Identity</Link>}
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
                      className="mt-5 rounded-xl border border-success px-8 py-5 bg-success/2 text-success/90 hover:bg-success/5 dark:hover:bg-success/10"
                      render={
                        <Link href="/create-account">
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
