import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isAdminClaims } from "@/lib/admin";

// Belt-and-suspenders: `proxy.ts` already redirects non-admins away from
// `/admin(.*)` before this ever renders, but layouts are cheap to re-check
// and guard against any future matcher change silently losing coverage.
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { userId, sessionClaims } = await auth();

  if (!userId || !isAdminClaims(sessionClaims)) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">{children}</main>
  );
}
