import {
  Users,
  Users2,
  BookOpen,
  MessageCircle,
  Shield,
  ShieldCheck,
  KeyRound,
  MailCheck,
  LockKeyhole,
  Fingerprint,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AuthInfoProps {
  variant:
    | "default"
    | "login"
    | "forgot-password"
    | "verify-email"
    | "reset-password";
}

const AuthInfo = ({ variant = "default" }: AuthInfoProps) => {
  const content = (() => {
    switch (variant) {
      case "login":
        return {
          headline: "Welcome Back",
          title: "Smart NUB Campus",
          tagline: "Your Campus. Your Community. Your Future.",
          description:
            "Log in to access your academic dashboard, connect with classmates, and continue your learning journey.",
          features: [
            [ShieldCheck, "Secure login with student verification"],
            [Users2, "Access your campus community"],
            [BookOpen, "Continue where you left off"],
            [MessageCircle, "Stay updated with notifications"],
          ],
          badge: {
            icon: Shield,
            title: "Your account is protected",
            text: "We use industry-standard encryption to keep your data safe.",
          },
        };
      case "forgot-password":
        return {
          headline: "Recover Your",
          title: "Account Access",
          tagline: "Don't worry, we've got you covered.",
          description:
            "Enter your student ID or email and we'll send you a verification code to reset your password securely.",
          features: [
            [KeyRound, "Receive a secure verification code"],
            [MailCheck, "Code sent to your registered email"],
            [CheckCircle, "Reset in under a minute"],
            [Shield, "Your account stays fully protected"],
          ],
          badge: {
            icon: AlertCircle,
            title: "Need help?",
            text: "Contact support@nub.ac.bd if you can't access your email.",
          },
        };
      case "verify-email":
        return {
          headline: "Verify Your",
          title: "Email Address",
          tagline: "One last step to get started.",
          description:
            "We've sent a verification code to your email. Enter it below to activate your account and join Smart NUB Campus.",
          features: [
            [MailCheck, "Check your inbox for the code"],
            [Fingerprint, "Verify your student identity"],
            [CheckCircle, "Instant access after verification"],
            [Shield, "Your data remains secure"],
          ],
          badge: {
            icon: ShieldCheck,
            title: "Only verified students",
            text: "We ensure only NUB students can access the platform.",
          },
        };
      case "reset-password":
        return {
          headline: "Create a New",
          title: "Password",
          tagline: "Set a strong, new password.",
          description:
            "Enter the verification code sent to your email and choose a new password to regain access to your account.",
          features: [
            [KeyRound, "Enter your 6-digit verification code"],
            [LockKeyhole, "Choose a strong new password"],
            [CheckCircle, "Instant update after confirmation"],
            [Shield, "Your account stays fully protected"],
          ],
          badge: {
            icon: ShieldCheck,
            title: "Password requirements",
            text: "Use at least 8 characters with a mix of letters, numbers, and symbols.",
          },
        };
      default:
        return {
          headline: "Welcome to",
          title: "Smart NUB Campus",
          tagline: "Your Campus. Your Community. Your Future.",
          description:
            "Smart NUB Campus is an exclusive platform for Northern University Bangladesh students. Collaborate, learn, share resources and grow together in a trusted academic environment.",
          features: [
            [Users2, "Connect with verified NUB students"],
            [BookOpen, "Access notes, resources & discussions"],
            [MessageCircle, "Ask questions & get expert help"],
            [Users, "Find teammates & work on projects"],
          ],
          badge: {
            icon: Shield,
            title: "Secure. Verified. Trusted.",
            text: "Only Northern University Bangladesh students can join Smart NUB Campus.",
          },
        };
    }
  })();

  const BadgeIcon = content.badge.icon;

  return (
    <section className="relative flex min-h-0 lg:min-h-205 flex-col overflow-hidden p-6 sm:p-8 lg:p-12">
      <div className="relative z-10 max-w-xl">
        <h2 className="text-lg sm:text-2xl font-medium">{content.headline}</h2>
        <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl font-semibold tracking-tight">
          {content.title}
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-xl font-medium text-brand-hover dark:text-primary/90">
          {content.tagline}
        </p>
        <p className="mt-4 sm:mt-8 text-sm sm:text-base text-muted-foreground">
          {content.description}
        </p>

        <div className="mt-6 sm:mt-10 space-y-2">
          {content.features.map(([Icon, label], i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-brand-light dark:bg-primary/20">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-brand dark:text-primary" />
              </div>
              <span className="text-sm sm:text-base font-medium">
                {label as string}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: static badge at bottom. Desktop: absolute positioned badge. */}
      <div className="mt-6 lg:mt-0 lg:absolute lg:bottom-10 lg:left-10 lg:z-20 flex w-full sm:w-sm md:w-md lg:w-lg gap-3 rounded-2xl border bg-card/85 p-4 sm:p-5 shadow-xl backdrop-blur text-card-foreground">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-brand-light dark:bg-primary/20 shrink-0">
          <BadgeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand dark:text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-sm sm:text-base">
            {content.badge.title}
          </h3>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
            {content.badge.text}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthInfo;
