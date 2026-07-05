"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HyperlinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  underlineClassName?: string;
}

const Hyperlink: React.FC<HyperlinkProps> = ({
  href,
  children,
  className,
  underlineClassName,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-block text-sm font-medium tracking-wide text-foreground",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={cn(
          "absolute left-0 w-full h-[1.5px] bg-brand transform scale-x-0 transition-transform duration-500 ease-out -bottom-1",
          isHovered ? "scale-x-100 origin-left" : "scale-x-0 origin-right",
          underlineClassName,
        )}
      />
    </Link>
  );
};

export { Hyperlink };
