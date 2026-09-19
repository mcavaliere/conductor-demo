import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const name = user?.firstName ?? user?.username ?? "there";

  return (
    <div className="relative flex flex-1 items-center justify-center px-6 py-24">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--neon)]" />
          System online
        </span>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome, <span className="neon-text">{name}</span>.
        </h1>

        <p className="max-w-md text-balance text-muted-foreground">
          You&apos;re authenticated. This page is protected by Clerk — signed-out
          visitors are routed straight back to the sign-in gate.
        </p>

        <div className="mt-2 grid w-full grid-cols-3 gap-3 font-mono text-xs">
          {[
            { label: "Auth", value: "SECURE" },
            { label: "Session", value: "ACTIVE" },
            { label: "Latency", value: "12ms" },
          ].map((stat) => (
            <div key={stat.label} className="neon-panel rounded-lg px-3 py-4">
              <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
              <div className="mt-1 text-sm font-semibold text-primary">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
