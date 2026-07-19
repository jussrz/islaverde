import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { updateProfileAction } from "./actions";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { error, saved } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-20 sm:px-6">
      <h1 className="font-display text-3xl text-foreground">Your profile</h1>
      <p className="mt-2 text-sm text-muted">
        {session.user.role === "ADMIN" ? "Admin account" : "Guest account"}
      </p>

      {saved ? (
        <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Profile updated.
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <form action={updateProfileAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="text-xs font-medium text-muted">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={session.user.name ?? ""}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted">
            This is the name used when you book a villa.
          </p>
        </div>

        <div>
          <span className="text-xs font-medium text-muted">Email</span>
          <p className="mt-1 rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-muted">
            {session.user.email}
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
