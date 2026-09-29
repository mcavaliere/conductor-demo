import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdminClaims } from "@/lib/admin";

// Belt-and-suspenders: the proxy already protects /admin (including the
// admin-role check), but Server Actions are directly reachable, so we
// re-check here and in every action.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");
  if (!isAdminClaims(sessionClaims)) redirect("/");

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">{children}</main>
  );
}
