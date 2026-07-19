type Amenity = { id: string; name: string };
type Resort = { id: string; name: string };

type VillaFormValues = {
  resortId: string;
  name: string;
  slug: string;
  description: string | null;
  basePricePerNight: number | string;
  capacity: number;
  totalRooms: number;
  amenityIds: string[];
};

export function VillaForm({
  action,
  resorts,
  amenities,
  defaultValues,
  error,
}: {
  action: (formData: FormData) => void;
  resorts: Resort[];
  amenities: Amenity[];
  defaultValues?: Partial<VillaFormValues>;
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
            placeholder="overwater-villa"
            defaultValue={defaultValues?.slug}
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="basePricePerNight" className="text-xs font-medium text-muted">
            Price / night (USD)
          </label>
          <input
            id="basePricePerNight"
            name="basePricePerNight"
            type="number"
            step="0.01"
            min={0}
            required
            defaultValue={defaultValues?.basePricePerNight}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="capacity" className="text-xs font-medium text-muted">
            Max guests
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            required
            defaultValue={defaultValues?.capacity}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="totalRooms" className="text-xs font-medium text-muted">
            Units available
          </label>
          <input
            id="totalRooms"
            name="totalRooms"
            type="number"
            min={1}
            required
            defaultValue={defaultValues?.totalRooms ?? 1}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <span className="text-xs font-medium text-muted">Amenities</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {amenities.map((amenity) => (
            <label key={amenity.id} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="amenityIds"
                value={amenity.id}
                defaultChecked={defaultValues?.amenityIds?.includes(amenity.id)}
              />
              {amenity.name}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Save villa
      </button>
    </form>
  );
}
