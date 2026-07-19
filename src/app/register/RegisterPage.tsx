import Link from "next/link";
import { isGoogleSignInEnabled } from "@/lib/auth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { registerAction } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  InvalidInput: "Please check your details and try again.",
  EmailTaken: "An account with that email already exists.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-20 sm:px-6">
      <h1 className="font-display text-3xl text-foreground">Create an account</h1>
      <p className="mt-2 text-sm text-muted">
        Optional — you can also book as a guest without an account.
      </p>

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {ERROR_MESSAGES[error] ?? "Something went wrong."}
        </p>
      ) : null}

      {isGoogleSignInEnabled ? (
        <div className="mt-6 space-y-4">
          <GoogleSignInButton />
          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      ) : null}

      <form action={registerAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="text-xs font-medium text-muted">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-medium text-muted">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Sign up
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
