type Resort = { id: string; name: string };

type DiningFormValues = {
  resortId: string;
  name: string;
  slug: string;
  description: string | null;
  cuisineType: string | null;
  openingHours: string | null;
};

export function DiningForm({
  action,
  resorts,
  defaultValues,
  error,
}: {
  action: (formData: FormData) => void;
  resorts: Resort[];
  defaultValues?: Partial<DiningFormValues>;
  error?: string;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div>
        <label htmlFor="resortId" className="text-xs font-medium text-muted">
          Resort
        </label>
        <select
          id="resortId"
          name="resortId"
          defaultValue={defaultValues?.resortId ?? resorts[0]?.id}
          className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        >
          {resorts.map((resort) => (
            <option key={resort.id} value={resort.id}>
              {resort.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-xs font-medium text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={defaultValues?.name}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="slug" className="text-xs font-medium text-muted">
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            placeholder="the-reef"
            defaultValue={defaultValues?.slug}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cuisineType" className="text-xs font-medium text-muted">
            Cuisine type
          </label>
          <input
            id="cuisineType"
            name="cuisineType"
            type="text"
            defaultValue={defaultValues?.cuisineType ?? ""}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="openingHours" className="text-xs font-medium text-muted">
            Opening hours
          </label>
          <input
            id="openingHours"
            name="openingHours"
            type="text"
            placeholder="6:00 PM – 10:30 PM"
            defaultValue={defaultValues?.openingHours ?? ""}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-xs font-medium text-muted">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? ""}
          className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Save venue
      </button>
    </form>
  );
}
