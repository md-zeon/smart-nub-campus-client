import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 sm:p-16 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl sm:text-4xl font-bold text-center sm:text-left">
          Smart NUB Campus Client
        </h1>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4 sm:mt-0">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/auth"
          >
            Start here
          </Link>
        </div>
      </div>
      <div className="mt-8 lg:mt-0 w-full lg:w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30 text-center lg:text-left">
        <p className="text-sm">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <Button className="mt-2">Button</Button>
      </div>
    </main>
  );
}
