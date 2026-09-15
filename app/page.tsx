import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const name = user?.firstName ?? user?.username ?? "there";

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30 px-6 py-16">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome, {name}.
        </h1>
        <p className="text-muted-foreground">
          You&apos;re signed in. This page is protected by Clerk — signed-out
          visitors are redirected to sign in.
        </p>
      </div>
    </div>
  );
}
