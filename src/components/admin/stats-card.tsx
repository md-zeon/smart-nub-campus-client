import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

// ── Component ────────────────────────────────────────────────────────────────

interface StatsCardProps {
  /** Display label for the stat. */
  label: string;
  /** The formatted numeric value to display. */
  value: string | number;
  /** Icon component to render in the card header. */
  icon: React.ComponentType<{ className?: string }>;
  /** Percentage change from previous period. Positive = up, negative = down. */
  trend?: number;
  /** Whether this stat needs warning/danger styling (e.g. pending items). */
  isWarning?: boolean;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Dashboard stat card with icon, value, and optional trend indicator.
 * Used in the admin dashboard stats grid.
 */
export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  isWarning = false,
  className,
}: StatsCardProps) {
  const hasTrend = trend !== undefined && trend !== null;
  const isPositive = hasTrend && trend! > 0;
  const isNegative = hasTrend && trend! < 0;

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800",
        isWarning
          ? "border-red-200 dark:border-red-800"
          : "border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-lg",
            isWarning
              ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
          )}
        >
          <Icon className="size-6" />
        </div>
      </div>

      {/* Trend indicator */}
      {hasTrend && (
        <div className="mt-3 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="size-4 text-green-600" />
          ) : isNegative ? (
            <TrendingDown className="size-4 text-red-600" />
          ) : null}
          <span
            className={cn(
              "text-sm font-medium",
              isPositive && "text-green-600",
              isNegative && "text-red-600",
              !isPositive && !isNegative && "text-muted-foreground",
            )}
          >
            {isPositive && "+"}
            {trend}%
          </span>
          <span className="text-sm text-muted-foreground">from last month</span>
        </div>
      )}

      {/* Warning indicator for pending items */}
      {isWarning && !hasTrend && (
        <div className="mt-3 flex items-center gap-1">
          <span className="text-sm font-medium text-red-600">
            Requires attention
          </span>
        </div>
      )}
    </div>
  );
}
