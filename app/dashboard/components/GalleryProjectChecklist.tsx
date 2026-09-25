import { GALLERY_PROJECT_OPTIONS } from "./galleryProjectOptions";

interface GalleryProjectChecklistProps {
  selected: string[];
  onChange: (slugs: string[]) => void;
  disabled?: boolean;
}

// Multi-select of project pages for a gallery item, shared by the upload modal and the grid's
// "Change project" modal. Keeps the result in GALLERY_PROJECT_OPTIONS order regardless of the
// order boxes were ticked in.
const GalleryProjectChecklist = ({ selected, onChange, disabled }: GalleryProjectChecklistProps) => {
  const toggle = (slug: string) => {
    const next = selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug];
    onChange(GALLERY_PROJECT_OPTIONS.map((option) => option.slug).filter((s) => next.includes(s)));
  };

  return (
    <div>
      <label className="flex items-center gap-2 p-2 rounded bg-gray-50 text-sm text-gray-500 cursor-not-allowed">
        <input type="checkbox" checked disabled className="h-4 w-4" />
        General (main gallery) — always included
      </label>
      <div className="mt-1 max-h-56 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
        {GALLERY_PROJECT_OPTIONS.map((option) => (
          <label
            key={option.slug}
            className={`flex items-center gap-2 p-2 text-sm ${disabled ? "opacity-60" : "cursor-pointer hover:bg-gray-50"}`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option.slug)}
              onChange={() => toggle(option.slug)}
              disabled={disabled}
              className="h-4 w-4 accent-indigo-600"
            />
            {option.title}
          </label>
        ))}
      </div>
    </div>
  );
};

export default GalleryProjectChecklist;
