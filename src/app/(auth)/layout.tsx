import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InformationCircleIcon } from "@/components/ui/icons/information-circle";
import { AcademicCapIcon } from "@/components/ui/icons/academic-cap";
import { CircleQuestionMark } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full max-w-7xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <AcademicCapIcon className="text-brand" size={36} />
          <div className="-space-y-1">
            <h1 className="font-bold text-xl text-foreground">Smart NUB</h1>
            <p className="text-brand text-sm font-bold">Campus</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground items-center gap-2 hidden sm:flex"
          >
            <InformationCircleIcon />
            About Smart NUB Campus
          </Link>
          <Button variant="outline">
            <CircleQuestionMark />
            Need Help?
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <footer className="w-full max-w-3xl mt-8 flex justify-between items-center text-xs text-muted-foreground flex-col sm:flex-row gap-4">
        <p>
          © {new Date().getFullYear()} Northern University Bangladesh. All
          rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="text-brand hover:underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="text-brand hover:underline">
            Terms of Use
          </Link>
        </div>
      </footer>
    </div>
  );
}
