import { GALLERY_PROJECT_OPTIONS } from "./galleryProjectOptions";

interface GalleryProjectChecklistProps {
  inMainGallery: boolean;
  onMainGalleryChange: (inMainGallery: boolean) => void;
  selected: string[];
  onChange: (slugs: string[]) => void;
  disabled?: boolean;
}

// Where a gallery item appears: the sitewide main gallery, plus any number of project pages.
// Shared by the upload modal and the grid's "Change project" modal. Keeps project slugs in
// GALLERY_PROJECT_OPTIONS order regardless of the order boxes were ticked in.
const GalleryProjectChecklist = ({
  inMainGallery,
  onMainGalleryChange,
  selected,
  onChange,
  disabled,
}: GalleryProjectChecklistProps) => {
  const toggle = (slug: string) => {
    const next = selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug];
    onChange(GALLERY_PROJECT_OPTIONS.map((option) => option.slug).filter((s) => next.includes(s)));
  };

  const rowClass = `flex items-center gap-2 p-2 text-sm ${disabled ? "opacity-60" : "cursor-pointer hover:bg-gray-50"}`;

  return (
    <div>
      <label className={`${rowClass} border border-gray-200 rounded-lg font-medium`}>
        <input
          type="checkbox"
          checked={inMainGallery}
          onChange={(e) => onMainGalleryChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 accent-indigo-600"
        />
        General (main gallery slider)
      </label>
      <div className="mt-2 max-h-56 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
        {GALLERY_PROJECT_OPTIONS.map((option) => (
          <label key={option.slug} className={rowClass}>
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
      {!inMainGallery && selected.length === 0 && (
        <p className="text-xs text-amber-600 mt-1">Nothing ticked — this item won&apos;t appear anywhere on the public site.</p>
      )}
    </div>
  );
};

export default GalleryProjectChecklist;
