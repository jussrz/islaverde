import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { deleteVillaAction } from "./actions";

export default async function AdminVillasPage() {
  const villas = await prisma.villa.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-foreground">Villas</h1>
        <Link
          href="/admin/villas/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Add villa
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price / night</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {villas.map((villa) => (
              <tr key={villa.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{villa.name}</td>
                <td className="px-4 py-3 text-foreground">
                  {formatCurrency(villa.basePricePerNight.toString())}
                </td>
                <td className="px-4 py-3 text-foreground">{villa.capacity}</td>
                <td className="px-4 py-3 text-foreground">{villa._count.bookings}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/villas/${villa.id}`} className="text-primary hover:underline">
                      Edit
                    </Link>
                    <form action={deleteVillaAction.bind(null, villa.id)}>
                      <button type="submit" className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {villas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No villas yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
