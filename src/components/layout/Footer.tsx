export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} Islaverde Resorts. Portfolio project — not a real booking service.</p>
        <p>Built with Next.js, Prisma &amp; Supabase.</p>
      </div>
    </footer>
  );
}
