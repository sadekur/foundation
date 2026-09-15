// Language-independent facts pulled from the foundation's brochure (As-Salsabil Foundation.pdf).
// NOTE: the brochure only gives handles, not URLs — verify/replace these hrefs with the
// foundation's actual channel/page links before relying on them.
export const siteConfig = {
  phones: ["01780-664660", "01717-136456"],
  email: "salsabilfoundation1@gmail.com",
  youtube: {
    label: "As-Salsabil tv",
    handle: "/As-Salsabil tv",
    href: "https://www.youtube.com/@AsSalsabilTv",
    // Resolved once via YouTube Data API v3 (channels.list?forHandle=@AsSalsabilTv&part=id)
    // — hardcoded here since a channel's ID essentially never changes, unlike its playlists
    // (which the Gallery's YouTube tab fetches live). Replace with the real resolved ID.
    channelId: "",
  },
  facebook: { label: "As Salsabil-foundation", handle: "/As Salsabil-foundation", href: "" },
  blogUrl: "https://salsabilfoundation.blogspot.com/",
  // Surah Fatir (35), ayah 29 — verified against quran.com/en/fatir/29.
  // Arabic script doesn't change between the bn/en language toggle.
  quranVerseArabic:
    "إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ",
};

export interface ProjectMedia {
  image: string | null;
  video: string | null;
}

// One entry per entry in `dictionaries.ts`'s `projects.categories` (bn and en share the same
// category order and `slug`s — see PROJECT_CATEGORY_SLUGS below) — the Our Projects grid and
// each project's detail page read this array by index to decide what to show in the media panel.
//
// To add real media later: drop the file under `public/projects/` (e.g. `public/projects/zakat.jpg`)
// and set `image` (or `video`, for an mp4) to that path, e.g. "/projects/zakat.jpg". `video` takes
// priority over `image` when both are set (the image is used as the video's poster frame). Leaving
// both `null` falls back to a themed placeholder with the category's icon.
export const projectMedia: ProjectMedia[] = [
  { image: "/projects/islamic-education-dawah.jpg", video: null }, // Islamic Education & Dawah
  { image: "/projects/islamic-education-dawah.jpg", video: null }, // Qur'an & Islamic Teaching
  { image: null, video: null }, // Islamic Library & Publications
  { image: null, video: null }, // Zakat & Sadaqah Projects
  { image: null, video: null }, // Orphans, Students of Knowledge & the Poor
  { image: null, video: null }, // Tube Wells & Public Welfare
  { image: null, video: null }, // Tree Plantation & Eco-Friendly Activities
  { image: null, video: null }, // Free Medical Care & Humanitarian Aid
  { image: null, video: null }, // Mosque & Madrasa Construction Support
  { image: null, video: null }, // Rehabilitation & Employment Support
];

// One entry per category, same index/order as `projectMedia` above — the wide background photo
// behind the hero banner on each category's detail page (app/(public)/projects/[slug]). This is
// deliberately separate from `projectMedia`'s `image`/`video` (the showcase card's media panel is
// a different crop/purpose) so a category can have a card photo without a banner, or vice versa.
//
// To add one: drop the file under `public/projects/banners/` (e.g. `public/projects/banners/zakat.jpg`)
// and set the path here, e.g. "/projects/banners/zakat.jpg". Recommended source size: a landscape
// photo at least 1920x600px (roughly 3:1), main subject centered — the hero renders full-bleed width
// at a height driven by the overlaid text (not a fixed aspect ratio), so the image is cropped via
// object-cover to whatever height that ends up being (shorter on mobile, taller on desktop); a centered
// subject on a sufficiently large source survives any of those crops. Leaving `null` falls back to the
// plain dark green pattern background used today.
export const projectBanners: (string | null)[] = [
  null, // Islamic Education & Dawah
  null, // Qur'an & Islamic Teaching
  null, // Islamic Library & Publications
  null, // Zakat & Sadaqah Projects
  null, // Orphans, Students of Knowledge & the Poor
  null, // Tube Wells & Public Welfare
  null, // Tree Plantation & Eco-Friendly Activities
  null, // Free Medical Care & Humanitarian Aid
  null, // Mosque & Madrasa Construction Support
  null, // Rehabilitation & Employment Support
];

// Static routing keys for app/(public)/projects/[slug] — identical to the `slug` field on each
// entry in dictionaries.ts's bn/en `projects.categories` (kept here too since routing needs a
// language-independent list for generateStaticParams, without importing the language dictionaries).
export const PROJECT_CATEGORY_SLUGS = [
  "deeni-shiksha-o-dawah",
  "quran-o-deeni-shikkhadan",
  "islami-pathagar-o-prokashona",
  "zakat-o-sadaka",
  "yatim-talibe-ilm-o-daridro",
  "tube-well-o-jonokollan",
  "brikkhoropon",
  "free-chikitsha-o-manobik-sahajjo",
  "masjid-madrasa-nirman",
  "punorbashon-o-kormosangsthan",
] as const;
