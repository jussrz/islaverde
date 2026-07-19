import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware.ts already gates /admin/*, but every
  // admin surface re-checks the role directly so nothing depends solely
  // on the middleware matcher being configured correctly.
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex max-w-6xl">
      <AdminSidebar />
      <div className="min-w-0 flex-1 px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
