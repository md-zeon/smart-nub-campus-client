import { Users, Users2, BookOpen, MessageCircle, Shield } from "lucide-react";

const AuthInfo = () => {
  return (
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
  );
};

export default AuthInfo;
