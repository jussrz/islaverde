import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type VillaCardProps = {
  slug: string;
  name: string;
  description: string | null;
  basePricePerNight: number | string;
  capacity: number;
  imageUrl?: string;
};

export function VillaCard({
  slug,
  name,
  description,
  basePricePerNight,
  capacity,
  imageUrl,
}: VillaCardProps) {
  return (
    <Link
      href={`/villas/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-foreground">{name}</h3>
        {description ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{description}</p>
        ) : null}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">Sleeps up to {capacity}</span>
          <span className="font-medium text-primary">
            {formatCurrency(basePricePerNight)}
            <span className="text-muted"> / night</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
