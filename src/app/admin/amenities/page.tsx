import { prisma } from "@/lib/prisma";
import { createAmenityAction, deleteAmenityAction } from "./actions";

export default async function AdminAmenitiesPage() {
  const amenities = await prisma.amenity.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { villas: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Amenities</h1>

      <form action={createAmenityAction} className="mt-6 flex max-w-md gap-3">
        <input
          name="name"
          type="text"
          required
          placeholder="e.g. Private Pool"
          className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Add
        </button>
      </form>

      <div className="mt-8 max-w-md divide-y divide-border rounded-xl border border-border bg-surface">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-foreground">
              {amenity.name}{" "}
              <span className="text-muted">({amenity._count.villas} villas)</span>
            </span>
            <form action={deleteAmenityAction.bind(null, amenity.id)}>
              <button type="submit" className="text-red-600 hover:underline">
                Delete
              </button>
            </form>
          </div>
        ))}
        {amenities.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No amenities yet.</p>
        ) : null}
      </div>
    </div>
  );
}
