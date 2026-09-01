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
// category order: Zakat, Sadaqah Jariyah, Rehabilitation) — the Our Projects page reads this
// array by index to decide what to show in each category's media panel.
//
// To add real media later: drop the file under `public/projects/` (e.g. `public/projects/zakat.jpg`)
// and set `image` (or `video`, for an mp4) to that path, e.g. "/projects/zakat.jpg". `video` takes
// priority over `image` when both are set (the image is used as the video's poster frame). Leaving
// both `null` falls back to a themed placeholder with the category's icon.
export const projectMedia: ProjectMedia[] = [
  { image: null, video: null }, // Zakat Project
  { image: null, video: null }, // Sadaqah Jariyah Projects
  { image: null, video: null }, // Rehabilitation Project
];
