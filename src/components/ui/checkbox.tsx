"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<"button">,
  "type"
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        ref={ref}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "peer size-4 shrink-0 rounded-lg border border-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className,
        )}
        {...props}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5"
          >
            <path d="M5 12l5 5l9 -9" />
          </svg>
        )}
      </button>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
