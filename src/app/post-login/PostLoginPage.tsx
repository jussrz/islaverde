import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Shared landing spot for both Credentials and Google sign-in — routes
// admins straight to the admin dashboard, everyone else to the homepage.
// A single gate here (rather than branching redirectTo per sign-in call)
// means OAuth doesn't need a separate role check, since the role isn't
// known until after its callback completes.
export default async function PostLoginPage() {
  const session = await auth();
  redirect(session?.user?.role === "ADMIN" ? "/admin" : "/");
}
