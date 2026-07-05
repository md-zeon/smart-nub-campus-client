import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InformationCircleIcon } from "@/components/ui/icons/information-circle";
import { AcademicCapIcon } from "@/components/ui/icons/academic-cap";
import { CircleQuestionMark } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Hyperlink } from "@/components/ui/hyperlink";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-8">
      <header className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AcademicCapIcon className="text-brand" size={36} />
          <div className="-space-y-1">
            <h1 className="font-bold text-xl text-foreground">Smart NUB</h1>
            <p className="text-brand text-sm font-bold">Campus</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
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

      <main className="flex-1 min-h-[calc(100vh-180px)]">{children}</main>
      <footer className="w-full max-w-3xl mx-auto flex justify-between items-center text-xs text-muted-foreground flex-col sm:flex-row gap-4">
        <p>
          © {new Date().getFullYear()} Northern University Bangladesh. All
          rights reserved.
        </p>
        <div className="flex gap-4">
          <Hyperlink href="/privacy" className="text-brand">
            Privacy Policy
          </Hyperlink>
          <span>•</span>
          <Hyperlink href="/terms" className="text-brand">
            Terms of Use
          </Hyperlink>
        </div>
      </footer>
    </div>
  );
}
