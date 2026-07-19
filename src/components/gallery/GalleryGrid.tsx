"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type GalleryCategory = "VILLA" | "DINING" | "RESORT" | "ACTIVITIES";

type GalleryImageItem = {
  id: string;
  url: string;
  caption: string | null;
  category: GalleryCategory;
};

const TABS: { value: GalleryCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "VILLA", label: "Villas" },
  { value: "DINING", label: "Dining" },
  { value: "RESORT", label: "Resort & Grounds" },
  { value: "ACTIVITIES", label: "Activities" },
];

export function GalleryGrid({ images }: { images: GalleryImageItem[] }) {
  const [active, setActive] = useState<GalleryCategory | "ALL">("ALL");
  const filtered = active === "ALL" ? images : images.filter((img) => img.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActive(tab.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === tab.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {filtered.map((img) => (
          <figure
            key={img.id}
            className="break-inside-avoid overflow-hidden rounded-xl border border-border bg-surface-muted"
          >
            <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
              <Image
                src={img.url}
                alt={img.caption ?? "Resort photo"}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {img.caption ? (
              <figcaption className="px-3 py-2 text-xs text-muted">{img.caption}</figcaption>
            ) : null}
          </figure>
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">No photos in this category yet.</p>
        ) : null}
      </div>
    </div>
  );
}
