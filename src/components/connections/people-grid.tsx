import { cn } from "@/lib/utils";

interface PeopleGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive grid for people cards — single column on mobile, multi-column on
 * larger viewports.
 */
export function PeopleGrid({ children, className }: PeopleGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
