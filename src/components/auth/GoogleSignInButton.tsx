import { signInWithGoogleAction } from "@/lib/auth-actions";

export function GoogleSignInButton() {
  return (
    <form action={signInWithGoogleAction}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3a7.4 7.4 0 0 1-11-3.9H.9v3.1A12 12 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.05 14.2A7.2 7.2 0 0 1 4.67 12c0-.76.14-1.5.38-2.2v-3.1H.9A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.3l3.77-3.1z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.7l3.77 3.1A7.2 7.2 0 0 1 12 4.75z"
          />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
