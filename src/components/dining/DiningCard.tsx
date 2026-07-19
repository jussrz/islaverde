import Image from "next/image";
import Link from "next/link";

type DiningCardProps = {
  slug: string;
  name: string;
  description: string | null;
  cuisineType: string | null;
  openingHours: string | null;
  imageUrl?: string;
};

export function DiningCard({
  slug,
  name,
  description,
  cuisineType,
  openingHours,
  imageUrl,
}: DiningCardProps) {
  return (
    <Link
      href={`/dining/${slug}`}
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
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg text-foreground">{name}</h3>
          {cuisineType ? (
            <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
              {cuisineType}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{description}</p>
        ) : null}
        {openingHours ? <p className="mt-3 text-xs text-muted">{openingHours}</p> : null}
      </div>
    </Link>
  );
}
