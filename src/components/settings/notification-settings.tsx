"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateNotificationSettingsAction } from "@/actions/settings.actions";
import type { UserNotificationSettings } from "@/types";

interface NotificationSettingsProps {
  settings: UserNotificationSettings;
}

const NOTIFICATION_CHANNELS = [
  {
    key: "resources" as const,
    label: "Resources",
    description: "New uploads in subscribed courses",
  },
  {
    key: "discussions" as const,
    label: "Discussions",
    description: "Replies and mentions",
  },
  {
    key: "qa" as const,
    label: "Q&A",
    description: "Answers, mentions, accepted answers",
  },
  {
    key: "messaging" as const,
    label: "Messaging",
    description: "New messages",
  },
  {
    key: "network" as const,
    label: "Network",
    description: "Connection requests and accepts",
  },
  {
    key: "teams" as const,
    label: "Teams",
    description: "Invitations and updates",
  },
  {
    key: "admin" as const,
    label: "Admin",
    description: "System announcements",
  },
] as const;

/**
 * Notification settings with in-app and email toggle switches per channel.
 */
export function NotificationSettings({ settings }: NotificationSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = async (
    field: keyof UserNotificationSettings,
  ) => {
    const newValue = !localSettings[field];
    setLocalSettings((prev) => ({ ...prev, [field]: newValue }));

    try {
      const result = await updateNotificationSettingsAction({
        [field]: newValue,
      });
      if (result.success) {
        toast.success("Notification setting updated.");
      } else {
        toast.error(result.message);
        // Revert on failure
        setLocalSettings((prev) => ({ ...prev, [field]: !newValue }));
      }
    } catch {
      toast.error("Failed to update notification setting.");
      setLocalSettings((prev) => ({ ...prev, [field]: !newValue }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notification Preferences</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose how you want to be notified for each feature.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_80px_80px] gap-2 pb-2 border-b text-xs font-medium text-muted-foreground">
            <span>Feature</span>
            <span className="text-center">In-App</span>
            <span className="text-center">Email</span>
          </div>

          {NOTIFICATION_CHANNELS.map(({ key, label, description }) => {
            const inAppKey = `${key}InApp` as keyof UserNotificationSettings;
            const emailKey = `${key}Email` as keyof UserNotificationSettings;

            return (
              <div
                key={key}
                className="grid grid-cols-[1fr_80px_80px] gap-2 py-3 border-b last:border-0 items-center"
              >
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <div className="flex justify-center">
                  <ToggleSwitch
                    checked={localSettings[inAppKey] as boolean}
                    onChange={() => handleToggle(inAppKey)}
                  />
                </div>
                <div className="flex justify-center">
                  <ToggleSwitch
                    checked={localSettings[emailKey] as boolean}
                    onChange={() => handleToggle(emailKey)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/** Simple toggle switch component. */
function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
