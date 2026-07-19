import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteDiningAction } from "./actions";

export default async function AdminDiningPage() {
  const venues = await prisma.dining.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-foreground">Dining</h1>
        <Link
          href="/admin/dining/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Add venue
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Cuisine</th>
              <th className="px-4 py-3 font-medium">Hours</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => (
              <tr key={venue.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{venue.name}</td>
                <td className="px-4 py-3 text-foreground">{venue.cuisineType}</td>
                <td className="px-4 py-3 text-foreground">{venue.openingHours}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/dining/${venue.id}`} className="text-primary hover:underline">
                      Edit
                    </Link>
                    <form action={deleteDiningAction.bind(null, venue.id)}>
                      <button type="submit" className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {venues.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No dining venues yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
