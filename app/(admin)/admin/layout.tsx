import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Belt-and-suspenders: the proxy already protects /admin, but Server Actions
// are directly reachable, so we re-check here and in every action.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">{children}</main>
  );
}
