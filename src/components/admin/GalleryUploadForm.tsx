"use client";

import { useState } from "react";
import { uploadImageAction } from "@/app/admin/gallery/actions";

type Option = { id: string; name: string };

export function GalleryUploadForm({
  resortId,
  villas,
  dinings,
}: {
  resortId: string;
  villas: Option[];
  dinings: Option[];
}) {
  const [category, setCategory] = useState<"VILLA" | "DINING" | "RESORT" | "ACTIVITIES">("RESORT");

  return (
    <form action={uploadImageAction} className="max-w-xl space-y-4 rounded-xl border border-border bg-surface p-5">
      <input type="hidden" name="resortId" value={resortId} />

      <div>
        <label htmlFor="file" className="text-xs font-medium text-muted">
          Image (JPEG, PNG, or WebP — max 5MB)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="mt-1 w-full text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="text-xs font-medium text-muted">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        >
          <option value="RESORT">Resort &amp; Grounds</option>
          <option value="ACTIVITIES">Activities</option>
          <option value="VILLA">Villa</option>
          <option value="DINING">Dining</option>
        </select>
      </div>

      {category === "VILLA" ? (
        <div>
          <label htmlFor="villaId" className="text-xs font-medium text-muted">
            Villa
          </label>
          <select
            id="villaId"
            name="villaId"
            required
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          >
            {villas.map((villa) => (
              <option key={villa.id} value={villa.id}>
                {villa.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {category === "DINING" ? (
        <div>
          <label htmlFor="diningId" className="text-xs font-medium text-muted">
            Dining venue
          </label>
          <select
            id="diningId"
            name="diningId"
            required
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          >
            {dinings.map((dining) => (
              <option key={dining.id} value={dining.id}>
                {dining.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="caption" className="text-xs font-medium text-muted">
          Caption (optional)
        </label>
        <input
          id="caption"
          name="caption"
          type="text"
          className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Upload
      </button>
    </form>
  );
}
