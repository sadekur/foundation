import type { Language } from "./LanguageProvider";

export interface NavDictionary {
  home: string;
  about: string;
  projects: string;
  activities: string;
  contact: string;
  brand: string;
}

export interface HomeDictionary {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroQuote: string;
  heroQuoteSource: string;
  ctaAbout: string;
  ctaProjects: string;
  ctaContact: string;
  introTitle: string;
  introBody: string;
  aboutLink: string;
  projectsTitle: string;
  projectsIntro: string;
  projectsViewAll: string;
  activitiesTitle: string;
  activitiesIntro: string;
  activitiesViewAll: string;
  supportWays: string[];
  donateLabel: string;
}

export interface AboutDictionary {
  title: string;
  introTitle: string;
  intro: string[];
  missionTitle: string;
  missionBody: string;
  nameTitle: string;
  nameBody: string;
  valuesTitle: string;
  values: { title: string; body: string }[];
  // The brochure's five project groups. Broader than `projects.categories`, and also the names
  // that bounce around the home hero.
  projectsTitle: string;
  projects: { title: string; points: string[] }[];
  projectsNote: string;
  supportTitle: string;
  supportBody: string[];
  supportDua: string;
  supportTagline: string;
  ctaProjects: string;
  ctaContact: string;
  brochureTitle: string;
  brochureBody: string;
  brochureView: string;
  brochureDownload: string;
}

export interface ProjectFaqItem {
  question: string;
  answer: string;
}

export interface ProjectImpactStat {
  value: string;
  label: string;
}

export interface ProjectHighlights {
  title: string;
  items: string[];
}

export interface ProjectSupportSection {
  title: string;
  body: string;
}

// `description` and `support.body` may hold several paragraphs separated by a blank line ("\n\n"),
// and each paragraph supports **bold** markers. `highlights` and `support` are optional extras
// rendered by the detail page only when present.
//
// `slug` is the language-independent routing key for /projects/[slug] (see PROJECT_CATEGORY_SLUGS
// below) — kept identical between the bn and en entry at the same array index. Every other field
// is real brochure-derived copy for the summary card; `description` through `faq` back the detail
// page and are placeholder/generic copy until the foundation supplies real per-project figures
// (objectives, budget, area, duration are safe generic statements — deliberately no invented
// numbers or stats). `impactStats` is optional and left unset for most categories, which keeps the
// detail page's impact section on `ProjectDetailDictionary.impactComingSoon`; set it once the
// foundation supplies real figures for that category (see `galleryComingSoon` for the still-unbuilt
// per-category gallery).
export interface ProjectCategory {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  highlights?: ProjectHighlights;
  support?: ProjectSupportSection;
  objectives: string[];
  targetAudience: string;
  budgetItems: string[];
  area: string;
  duration: string;
  faq: ProjectFaqItem[];
  impactStats?: ProjectImpactStat[];
}

export interface ProjectsDictionary {
  title: string;
  intro: string;
  categories: ProjectCategory[];
  closingNote: string;
  supportCta: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  detailsButton: string;
}

// Static section labels for app/(public)/projects/[slug] — the per-category content itself
// lives in ProjectsDictionary.categories.
export interface ProjectDetailDictionary {
  backToProjects: string;
  descriptionTitle: string;
  objectivesTitle: string;
  audienceTitle: string;
  budgetTitle: string;
  areaTitle: string;
  durationTitle: string;
  galleryTitle: string;
  galleryComingSoon: string;
  impactTitle: string;
  impactComingSoon: string;
  faqTitle: string;
  notFoundTitle: string;
  notFoundBody: string;
}

export interface GalleryDictionary {
  title: string;
  intro: string;
  tabMedia: string;
  tabYoutube: string;
  emptyMediaMessage: string;
  emptyYoutubeMessage: string;
  loadMore: string;
  loadingMore: string;
  loadMoreError: string;
  watchOnYoutube: string;
  playlistVideoCount: string;
}

export interface ActivitiesDictionary {
  title: string;
  intro: string;
  readMore: string;
  emptyMessage: string;
  visitBlog: string;
  loadMore: string;
  loadingMore: string;
  loadMoreError: string;
}

export interface ContactFormDictionary {
  title: string;
  intro: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactDictionary {
  title: string;
  intro: string;
  officeLabel: string;
  office: string;
  phoneLabel: string;
  phoneNote: string;
  emailLabel: string;
  donationTitle: string;
  donationBody: string;
  socialTitle: string;
  form: ContactFormDictionary;
}

export interface FooterDictionary {
  tagline: string;
  rights: string;
}

export interface Dictionary {
  nav: NavDictionary;
  home: HomeDictionary;
  about: AboutDictionary;
  projects: ProjectsDictionary;
  projectDetail: ProjectDetailDictionary;
  gallery: GalleryDictionary;
  activities: ActivitiesDictionary;
  contact: ContactDictionary;
  footer: FooterDictionary;
}

// Shared across every project category for now — generic, evergreen questions that are true
// regardless of the specific project, unlike the numeric claims in ProjectDetailDictionary's
// impact section (which stay as an explicit "coming soon" placeholder instead of invented data).
const PROJECT_FAQ_BN: ProjectFaqItem[] = [
  {
    question: "আমি কীভাবে এই প্রকল্পে অনুদান করতে পারি?",
    answer:
      "বিকাশ, নগদ অথবা সরাসরি যোগাযোগের মাধ্যমে আপনি এই প্রকল্পে অনুদান পাঠাতে পারেন। বিস্তারিত জানতে আমাদের যোগাযোগ পাতা দেখুন।",
  },
  {
    question: "এই প্রকল্প সম্পর্কে আরও তথ্য কোথায় পাব?",
    answer: "আরও তথ্যের জন্য আমাদের সাথে ইমেইল বা ফোনে যোগাযোগ করতে পারেন — আমরা যত দ্রুত সম্ভব সাড়া দেব।",
  },
];

const PROJECT_FAQ_EN: ProjectFaqItem[] = [
  {
    question: "How can I donate to this project?",
    answer: "You can send a donation via bKash, Nagad, or by contacting us directly. See our Contact page for details.",
  },
  {
    question: "Where can I learn more about this project?",
    answer: "Reach out to us by email or phone for more information — we'll respond as soon as possible.",
  },
];

export const dictionaries: Record<Language, Dictionary> = {
  bn: {
    nav: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      projects: "আমাদের প্রকল্প",
      activities: "আমাদের কার্যক্রম",
      contact: "যোগাযোগ",
      brand: "আস্-সালসাবিল ফাউন্ডেশন",
    },
    home: {
      heroEyebrow: "প্রতিষ্ঠিত ২০২১",
      heroTitle: "আস্-সালসাবিল ফাউন্ডেশন",
      heroSubtitle:
        "মুকুন্দপুর (কানাইপাড়া), কোচাশহর, গোবিন্দগঞ্জ, গাইবান্ধা — সাদাকায়ে জারিয়ামূলক কার্যক্রমের মাধ্যমে দ্বীন ও মানবতার সেবা",
      heroQuote:
        "“যারা আল্লাহর কিতাব পাঠ করে, সালাত কায়েম করে এবং আমি যা দিয়েছি তা থেকে গোপনে ও প্রকাশ্যে ব্যয় করে, তারা এমন ব্যবসার আশা করে যাতে কখনও লোকসান হবে না।”",
      heroQuoteSource: "সূরা ফাতির, আয়াত ২৯",
      ctaAbout: "আমাদের সম্পর্কে জানুন",
      ctaProjects: "আমাদের প্রকল্পসমূহ",
      ctaContact: "যোগাযোগ করুন",
      introTitle: "পরিচিতি",
      introBody:
        "কুরআন মাজীদের উপরোক্ত আয়াতটি স্লোগান করে ২০২১ সালের ফেব্রুয়ারি মাসে “আস্-সালসাবিল ফাউন্ডেশন” প্রতিষ্ঠিত হয়েছে। যার মাধ্যমে রাসুল (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম) এর সুন্নাহ ও নির্দেশনা অনুসরণ করে সাদাকায়ে জারিয়ামূলক প্রকল্পসমূহ পরিচালিত হয়, যা সম্পূর্ণ অ-রাজনৈতিক।",
      aboutLink: "আমাদের সম্পর্কে আরও জানুন",
      projectsTitle: "আমাদের প্রকল্পসমূহ",
      projectsIntro: "দ্বীনি শিক্ষা থেকে শুরু করে মানবকল্যাণ পর্যন্ত আমাদের চলমান ও পরিকল্পিত কয়েকটি কার্যক্রম।",
      projectsViewAll: "সকল প্রকল্প দেখুন",
      activitiesTitle: "সাম্প্রতিক কার্যক্রম",
      activitiesIntro: "আমাদের কার্যক্রম ও আয়োজনের সর্বশেষ প্রতিবেদন।",
      activitiesViewAll: "সকল কার্যক্রম দেখুন",
      supportWays: ["দোয়া", "পরামর্শ", "স্বেচ্ছাসেবা", "আর্থিক সহযোগিতা"],
      donateLabel: "বিকাশ / নগদ",
    },
    about: {
      title: "আমাদের সম্পর্কে",
      introTitle: "আমাদের পরিচিতি",
      intro: [
        "মানবজীবনের সর্বোত্তম অর্জন হলো আল্লাহর সন্তুষ্টি লাভ। আর এমন কল্যাণকর কাজে অংশগ্রহণ করা, যার সুফল মানুষের মাঝে দীর্ঘদিন অব্যাহত থাকে, হতে পারে আখিরাতের পাথেয় অর্জনের একটি গুরুত্বপূর্ণ মাধ্যম।",
        "এই প্রত্যয়কে সামনে রেখে ২০২১ সালের ফেব্রুয়ারি মাসে প্রতিষ্ঠিত হয় আস্-সালসাবিল ফাউন্ডেশন। পবিত্র কুরআন ও সহীহ সুন্নাহর নির্দেশনা অনুসরণ করে দ্বীনি শিক্ষা বিস্তার, বিশুদ্ধ আকীদাহ ও মানহাজের দাওয়াহ, অসহায় মানুষের সহযোগিতা এবং জনকল্যাণমূলক সাদকায়ে জারিয়ামূলক কার্যক্রম পরিচালনা করাই আমাদের অঙ্গীকার।",
        "আমরা বিশ্বাস করি, দ্বীনের সঠিক শিক্ষা ও মানুষের কল্যাণে আন্তরিক প্রচেষ্টা একটি সুন্দর, সচেতন ও কল্যাণমুখী সমাজ গঠনে ভূমিকা রাখতে পারে। আলহামদুলিল্লাহ, এই লক্ষ্যেই আমাদের কার্যক্রম পরিচালিত হচ্ছে।",
      ],
      missionTitle: "আমাদের লক্ষ্য ও উদ্দেশ্য",
      missionBody:
        "কুরআন ও সুন্নাহর আলোকে দ্বীনি জ্ঞান বিস্তার, বিশুদ্ধ আকীদাহ ও সহীহ মানহাজের দাওয়াহ প্রচার এবং মানবকল্যাণমূলক দীর্ঘস্থায়ী প্রকল্প বাস্তবায়নের মাধ্যমে আল্লাহর সন্তুষ্টি অর্জন করা।",
      nameTitle: "সালসাবিল নামের তাৎপর্য",
      nameBody:
        "সালসাবিল জান্নাতের একটি ঝর্ণাধারা। ফরজ ইবাদাত-আমলের পাশাপাশি সাদাকায়ে জারিয়াহ এমন একটি আমল, যার প্রতিদান মানুষ মৃত্যুর পরেও পেতে থাকে।",
      valuesTitle: "আমাদের মূলনীতি",
      values: [
        {
          title: "রাসুলের (সা.) সুন্নাহ অনুসরণ",
          body: "প্রতিটি কার্যক্রম রাসুলুল্লাহ (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম) এর সুন্নাহ ও নির্দেশনা মেনে পরিচালিত হয়।",
        },
        {
          title: "অ-রাজনৈতিক",
          body: "ফাউন্ডেশনের সকল সাদাকা ও জারিয়ামূলক কার্যক্রম সম্পূর্ণ অ-রাজনৈতিক দৃষ্টিভঙ্গিতে পরিচালিত হয়।",
        },
        {
          title: "স্বচ্ছ পরিচালনা",
          body: "সাদাকা/সাদাকায়ে জারিয়ার অর্থ সঠিকভাবে ও সুষ্ঠুভাবে নির্ধারিত খাতে ব্যয় করা হয়।",
        },
      ],
      projectsTitle: "আমাদের চলমান ও পরিকল্পিত প্রকল্পসমূহ",
      projects: [
        {
          title: "যাকাত, সাদাকাহ ও দরিদ্র সহায়তা",
          points: [
            "শরিয়াহসম্মত খাতে যাকাত বণ্টন",
            "দরিদ্র, অসহায় ও মিসকিনদের সহায়তা",
            "ইয়াতীম ও দরিদ্র তালিবে ইলমের পৃষ্ঠপোষকতা",
          ],
        },
        {
          title: "দ্বীনি শিক্ষা ও দাওয়াহ",
          points: [
            "মসজিদভিত্তিক শিশু ও বয়স্কদের কুরআন ও দ্বীনি শিক্ষা",
            "মহিলাদের কুরআন ও দ্বীনি শিক্ষার ব্যবস্থা",
            "দ্বীনি দারস, ইসলামী সেমিনার ও শিক্ষামূলক আয়োজন",
            "বিশুদ্ধ আকীদাহ ও সহীহ মানহাজভিত্তিক দাওয়াহ",
            "ইসলামী বই, লিফলেট ও দাওয়াহ-সামগ্রী প্রকাশ ও বিতরণ",
          ],
        },
        {
          title: "মসজিদ, মাদরাসা ও দ্বীনি প্রতিষ্ঠান",
          points: [
            "মসজিদ ও মাদরাসা নির্মাণে সহযোগিতা",
            "দ্বীনি শিক্ষা ও পাঠাগার কার্যক্রমের প্রসার",
            "বিনামূল্যে ইসলামী বই ও শিক্ষাসামগ্রী বিতরণ",
          ],
        },
        {
          title: "পানি, চিকিৎসা ও পরিবেশ",
          points: [
            "টিউবওয়েল স্থাপনের মাধ্যমে নিরাপদ পানির ব্যবস্থা",
            "বিনামূল্যে চিকিৎসাসেবা কার্যক্রম",
            "বৃক্ষরোপণ ও পরিবেশবান্ধব উদ্যোগ",
          ],
        },
        {
          title: "পুনর্বাসন ও কর্মসংস্থান",
          points: [
            "অসুস্থ, দরিদ্র ও অসহায় পরিবারের প্রয়োজনভিত্তিক সহায়তা",
            "সামর্থ্য ও প্রয়োজন অনুযায়ী ঘর নির্মাণে সহযোগিতা",
            "গৃহপালিত পশু বিতরণ ও কর্মসংস্থানের সুযোগ সৃষ্টিতে সহায়তা",
            "জরুরি প্রয়োজনে এককালীন সহযোগিতা",
          ],
        },
      ],
      projectsNote:
        "এ ছাড়া সাদাকাহ ও সাদকায়ে জারিয়ার অন্তর্ভুক্ত অন্যান্য কল্যাণমূলক কার্যক্রমও সামর্থ্য ও প্রয়োজন অনুযায়ী পরিচালিত হবে, ইনশাআল্লাহ।",
      supportTitle: "আপনার সহযোগিতায় এগিয়ে যাবে কল্যাণের এই উদ্যোগ",
      supportBody: [
        "একটি আন্তরিক সহযোগিতা হতে পারে কারও দ্বীনি শিক্ষা অর্জনের অবলম্বন, একটি অসহায় পরিবারের স্বস্তি কিংবা দীর্ঘস্থায়ী কল্যাণের কোনো উদ্যোগের সহায়ক।",
        "আসুন, দোয়া, পরামর্শ, স্বেচ্ছাসেবা ও আর্থিক সহযোগিতার মাধ্যমে আস্-সালসাবিল ফাউন্ডেশনের দ্বীনি ও মানবকল্যাণমূলক কার্যক্রমকে এগিয়ে নিতে পাশে থাকি।",
      ],
      supportDua:
        "আল্লাহ তাআলা আমাদের সকলের নেক আমল কবুল করুন, দান-সাদাকাহতে বরকত দান করুন এবং এই প্রচেষ্টাকে তাঁর সন্তুষ্টি অর্জনের মাধ্যম হিসেবে কবুল করুন। আমীন।",
      supportTagline: "দ্বীনি খেদমত ও মানবকল্যাণে—একটি আন্তরিক অঙ্গীকার।",
      ctaProjects: "আমাদের প্রকল্পসমূহ দেখুন",
      ctaContact: "যোগাযোগ করুন",
      brochureTitle: "আমাদের পরিচিতিপত্র",
      brochureBody: "ফাউন্ডেশনের পরিচিতি ও প্রকল্পসমূহের বিবরণ এক পাতায়।",
      brochureView: "পিডিএফ দেখুন",
      brochureDownload: "ডাউনলোড",
    },
    projects: {
      title: "আমাদের পরিকল্পিত প্রকল্প সমূহ",
      intro:
        "কুরআন মাজীদের নির্দেশনা ও রাসুলুল্লাহ (সা.) এর সুন্নাহ অনুসরণ করে আস্-সালসাবিল ফাউন্ডেশন সাদাকা ও সাদাকায়ে জারিয়ার বিভিন্ন খাতে কাজ করে।",
      categories: [
        {
          slug: "deeni-shiksha-o-dawah",
          title: "দ্বীনী শিক্ষা ও দাওয়াহ",
          blurb: "দ্বীনি দারস, ইসলামী সেমিনার ও দাওয়াহ কার্যক্রমের মাধ্যমে দ্বীন শিক্ষাদান।",
          description:
            "আলহামদুলিল্লাহ! আস্-সালসাবিল ফাউন্ডেশন প্রতিষ্ঠালগ্ন থেকেই পবিত্র কুরআন ও সহীহ সুন্নাহর আলোকে বিশুদ্ধ দ্বীনের জ্ঞান প্রচার, দাওয়াহ কার্যক্রম পরিচালনা এবং সমাজে ইসলামী মূল্যবোধ প্রতিষ্ঠার লক্ষ্যে কাজ করে যাচ্ছে।\n\n**২০২১ সাল থেকে নিয়মিত মাসিক তালীমী বৈঠক আয়োজনের মাধ্যমে আমাদের দাওয়াতী কার্যক্রমের ধারাবাহিক যাত্রা শুরু হয়।** এসব বৈঠকে কুরআন-সুন্নাহভিত্তিক আলোচনা, বিশুদ্ধ আকিদাহ, সহীহ মানহাজ, আত্মশুদ্ধি, আমল-আখলাক এবং সমসাময়িক দ্বীনি ও সামাজিক বিষয়ে দিকনির্দেশনা প্রদান করা হয়।\n\nনিয়মিত মাসিক তালীমী বৈঠকের পাশাপাশি প্রতিবছর **সুধী সমাবেশ ও সালসাবিল কনফারেন্স** আয়োজনের মাধ্যমে বৃহত্তর পরিসরে দ্বীনের দাওয়াত পৌঁছে দেওয়ার প্রচেষ্টা অব্যাহত রয়েছে। এসব আয়োজনের মাধ্যমে আলেম-উলামা, দ্বীনি ব্যক্তিত্ব, শিক্ষার্থী, যুবসমাজ এবং সর্বস্তরের ধর্মপ্রাণ মানুষের মধ্যে দ্বীনি সচেতনতা, পারস্পরিক ভ্রাতৃত্ব ও ইসলামী মূল্যবোধ জাগ্রত করার উদ্যোগ নেওয়া হয়।",
          highlights: {
            title: "আমাদের দাওয়াতী কার্যক্রমের উল্লেখযোগ্য দিক",
            items: [
              "নিয়মিত মাসিক তালীমী বৈঠক ও দ্বীনি আলোচনা আয়োজন।",
              "প্রতিবছর সুধী সমাবেশ ও বার্ষিক সালসাবিল কনফারেন্স আয়োজন।",
              "কুরআন ও সহীহ সুন্নাহভিত্তিক বিশুদ্ধ জ্ঞান প্রচার।",
              "বিশুদ্ধ আকিদাহ ও সহীহ মানহাজ সম্পর্কে সচেতনতা তৈরি।",
              "যুবসমাজ ও সাধারণ মানুষের মাঝে দ্বীনি সচেতনতা বৃদ্ধি।",
              "সামাজিক যোগাযোগমাধ্যম ও অনলাইন প্রচারমাধ্যমে দ্বীনি আলোচনা ও শিক্ষামূলক কনটেন্ট প্রচার।",
              "সমাজে ইসলামী মূল্যবোধ, ভ্রাতৃত্ব ও কল্যাণমূলক কর্মকাণ্ডের প্রসার।",
            ],
          },
          support: {
            title: "আপনার সহযোগিতা আমাদের পথচলাকে এগিয়ে নেবে",
            body:
              "এই ধারাবাহিক দাওয়াতী কার্যক্রম পরিচালনা, মাসিক তালীমী বৈঠক আয়োজন, বার্ষিক সুধী সমাবেশ ও সালসাবিল কনফারেন্স বাস্তবায়ন এবং দাওয়াহ কার্যক্রমকে আরও বিস্তৃত করার জন্য নিয়মিত আর্থিক সহযোগিতা প্রয়োজন।\n\nআমরা বিশ্বাস করি, দ্বীনের সঠিক জ্ঞান প্রচার ও মানুষের কাছে ইসলামের সৌন্দর্য পৌঁছে দেওয়ার এই প্রচেষ্টায় আপনার আন্তরিক অংশগ্রহণ হতে পারে একটি মূল্যবান অবদান।\n\n**আসুন, দ্বীনের প্রচার ও প্রসারে একসঙ্গে কাজ করি। আপনার স্বেচ্ছাধীন আর্থিক সহযোগিতা ও আন্তরিক অংশগ্রহণের মাধ্যমে এই মহৎ উদ্যোগের অংশীদার হোন। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "সহীহ আকিদা ও মানহাজ ভিত্তিক দ্বীনি শিক্ষার প্রসার",
            "২০২১ সাল থেকে চলমান নিয়মিত মাসিক তালীমী বৈঠক আয়োজন",
            "প্রতিবছর সুধী সমাবেশ ও সালসাবিল কনফারেন্স আয়োজন",
            "অনলাইন ও সামাজিক যোগাযোগমাধ্যমে শিক্ষামূলক কনটেন্ট প্রচার",
          ],
          targetAudience: "আলেম-উলামা, শিক্ষার্থী, যুবসমাজ ও সর্বস্তরের ধর্মপ্রাণ মানুষ",
          budgetItems: [
            "মাসিক তালীমী বৈঠকের আয়োজন ব্যয়",
            "বার্ষিক সুধী সমাবেশ ও সালসাবিল কনফারেন্স বাস্তবায়ন",
            "বক্তা ও শিক্ষকদের সম্মানী",
            "অনলাইন কনটেন্ট ও প্রচার সামগ্রী",
          ],
          area: "প্রয়োজন অনুযায়ী নির্ধারিত এলাকা ও অনলাইন",
          duration: "২০২১ সাল থেকে নিয়মিত ও চলমান কার্যক্রম",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "quran-o-deeni-shikkhadan",
          title: "কুরআন ও দ্বীনী শিক্ষাদান",
          blurb: "মসজিদ ভিত্তিক বয়স্ক ও মহিলাদের কুরআন ও দ্বীনি শিক্ষাদান কার্যক্রম।",
          description:
            "আস্-সালসাবিল ফাউন্ডেশনের তত্ত্বাবধানে পরিচালিত মক্তব শিক্ষা কার্যক্রমের মাধ্যমে ইতোমধ্যে অত্র অঞ্চলে **প্রায় ৩০টির অধিক মক্তব পরিচালিত হয়েছে।** এবং **বর্তমানে চলমান ৫ টি মক্তব চলমান রয়েছে।** এসব মক্তবে শিশু-কিশোরসহ বিভিন্ন বয়সী শিক্ষার্থীদের **সঠিক দ্বীন ও সহীহ মানহাজের ভিত্তিতে** কুরআন, আকীদাহ ও প্রয়োজনীয় দ্বীনী শিক্ষা প্রদান করা হয়ে থাকে। এই শিক্ষা কার্যক্রমের মানোন্নয়ন ও মক্তবের সংখ্যা সম্প্রসারণের লক্ষ্যে **শিক্ষকদের দক্ষতা ও পাঠদানের মানোন্নয়নে বিশেষ প্রশিক্ষণ কার্যক্রম চালু করা এবং প্রয়োজনীয় গাইডলাইন প্রদানের পরিকল্পনা রয়েছে।** পর্যাপ্ত আর্থিক সহযোগিতা প্রাপ্তির ভিত্তিতে এসব উদ্যোগ বাস্তবায়ন করা হবে। বর্তমানে ছোট-বড়, পুরুষ-মহিলা মিলিয়ে **প্রায় ৩৫০-এর অধিক শিক্ষার্থীর** শিক্ষা কার্যক্রমের যাবতীয় ব্যয় এবং কোর্স ফি সম্পূর্ণ বিনামূল্যে পরিচালনা করা হয়েছে, যেটি চলমান রয়েছে। এছাড়াও শিক্ষার্থীদের মাঝে **বিনামূল্যে কুরআন ও প্রয়োজনীয় পড়ালেখার সরঞ্জামাদি** বিতরণ করা হয়। দ্বীনী শিক্ষার এই কার্যক্রমে সকলের অংশগ্রহণ উন্মুক্ত ও সম্পূর্ণ ফ্রি। আপনার সামান্য সহযোগিতাও হতে পারে একজন শিশুর দ্বীনী শিক্ষার পথচলার সহায়ক — যার সওয়াব ইনশাআল্লাহ আপনার জন্য **সদকায়ে জারিয়া** হয়ে থাকতে পারে।",
          support: {
            title: "আপনার সহযোগিতায় এগিয়ে যাবে দ্বীনী শিক্ষার এই পথচলা",
            body:
              "চলমান ৫টি মক্তবের বিনামূল্যে শিক্ষা কার্যক্রম চালু রাখা, মক্তবের সংখ্যা সম্প্রসারণ, শিক্ষকদের সম্মানী প্রদান, কুরআন ও পড়ালেখার সরঞ্জামাদি বিতরণ এবং শিক্ষকদের প্রশিক্ষণ ও গাইডলাইন কার্যক্রম বাস্তবায়নের জন্য নিয়মিত আর্থিক সহযোগিতা প্রয়োজন।\n\nআপনার সামান্য অনুদানও একজন শিক্ষার্থীর কুরআন ও দ্বীনী শিক্ষার পথকে সহজ করতে পারে, যার সওয়াব ইনশাআল্লাহ আপনার জন্য সদকায়ে জারিয়া হয়ে থাকতে পারে।\n\n**আসুন, কুরআন ও দ্বীনী শিক্ষার এই কার্যক্রমে আমরা একসঙ্গে শরিক হই। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "সহীহভাবে কুরআন তিলাওয়াত শিক্ষাদান",
            "মহিলাদের জন্য পৃথক শিক্ষা ব্যবস্থা",
            "মসজিদ ভিত্তিক নিয়মিত ক্লাস পরিচালনা",
            "শিক্ষকদের দক্ষতা উন্নয়নে প্রশিক্ষণ ও গাইডলাইন প্রদান",
          ],
          targetAudience: "শিশু-কিশোরসহ সকল বয়সের পুরুষ ও মহিলা শিক্ষার্থী",
          budgetItems: ["শিক্ষকদের সম্মানী", "শিক্ষা উপকরণ", "শিক্ষকদের মান উন্নয়ন"],
          area: "মসজিদ ভিত্তিক নির্ধারিত এলাকা",
          duration: "নিয়মিত ও চলমান কার্যক্রম",
          faq: PROJECT_FAQ_BN,
          impactStats: [
            { value: "৩০+", label: "পরিচালিত মক্তব" },
            { value: "৩৫০+", label: "উপকৃত শিক্ষার্থী" },
            { value: "১০০%", label: "বিনামূল্যে শিক্ষা কার্যক্রম" },
          ],
        },
        {
          slug: "islami-pathagar-o-prokashona",
          title: "ইসলামী পাঠাগার ও প্রকাশনা",
          blurb: "বিশুদ্ধ আকিদা ভিত্তিক ইসলামী পাঠাগার স্থাপন ও ফ্রি বই-পুস্তক বিতরণ।",
          description:
            "বিভিন্ন মসজিদে বিশুদ্ধ আকিদা ও মানহাজ ভিত্তিক ইসলামী পাঠাগার স্থাপন করা হয় এবং ফ্রি ইসলামী বই, লিফলেট ও দোয়ার চার্ট প্রকাশনা ও বিতরণ করা হয়, যাতে সাধারণ মানুষ সহজে সঠিক দ্বীনি জ্ঞান অর্জন করতে পারেন।",
          support: {
            title: "আপনার সহযোগিতায় মানুষের কাছে পৌঁছাবে দ্বীনের সঠিক জ্ঞান",
            body:
              "বিভিন্ন মসজিদে বিশুদ্ধ আকিদা ও মানহাজ ভিত্তিক ইসলামী পাঠাগার স্থাপন এবং ফ্রি ইসলামী বই, লিফলেট ও দোয়ার চার্ট মুদ্রণ ও বিতরণের জন্য আর্থিক সহযোগিতা প্রয়োজন।\n\nআপনার অনুদানে প্রকাশিত একটি বই বা লিফলেটও কারও দ্বীনি জ্ঞান অর্জনের পথ সহজ করতে পারে, যার সওয়াব ইনশাআল্লাহ আপনার জন্য সদকায়ে জারিয়া হয়ে থাকতে পারে।\n\n**আসুন, সঠিক দ্বীনি জ্ঞান ছড়িয়ে দেওয়ার এই উদ্যোগে আমরা একসঙ্গে শরিক হই। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "মসজিদ ভিত্তিক পাঠাগার স্থাপন",
            "ফ্রি ইসলামী বই ও লিফলেট বিতরণ",
            "দোয়ার চার্ট প্রকাশনা",
          ],
          targetAudience: "মুসল্লি ও সাধারণ পাঠক",
          budgetItems: ["বই ও লিফলেট মুদ্রণ", "পাঠাগার আসবাবপত্র", "বিতরণ ব্যবস্থাপনা"],
          area: "নির্ধারিত মসজিদভিত্তিক এলাকা",
          duration: "চলমান প্রকল্প",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "zakat-o-sadaka",
          title: "যাকাত ও সাদকা প্রকল্প",
          blurb: "কুরআন মাজীদে বর্ণিত যাকাতের ৮টি খাতে অগ্রাধিকার ভিত্তিতে সঠিকভাবে বণ্টন।",
          description:
            "কুরআন মাজীদে বর্ণিত যাকাতের ৮টি খাত অনুসরণ করে অগ্রাধিকার ভিত্তিতে হকদারদের মাঝে যাকাত ও সাদকার অর্থ সঠিকভাবে বণ্টন করা হয়।",
          support: {
            title: "আপনার যাকাত ও সাদকা পৌঁছে যাক প্রকৃত হকদারের কাছে",
            body:
              "কুরআন মাজীদে বর্ণিত যাকাতের ৮টি খাত অনুসরণ করে প্রকৃত হকদার যাচাই, অগ্রাধিকার নির্ধারণ এবং স্বচ্ছ ও জবাবদিহিমূলক বণ্টনের মাধ্যমে এই প্রকল্প পরিচালিত হয়।\n\nআপনার যাকাত ও সাদকা নগদ অর্থ বা প্রয়োজনীয় সামগ্রী হিসেবে নির্ধারিত এলাকার হকদার পরিবারের মাঝে বিতরণ করা হয়।\n\n**আসুন, আমাদের যাকাত ও সাদকার মাধ্যমে হকদারদের পাশে দাঁড়াই। আল্লাহ তাআলা আমাদের সকলের দান কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "যাকাতের ৮টি খাত অনুযায়ী সঠিক বণ্টন",
            "প্রকৃত হকদার যাচাই ও অগ্রাধিকার নির্ধারণ",
            "স্বচ্ছ ও জবাবদিহিমূলক বাস্তবায়ন",
          ],
          targetAudience: "যাকাত ও সাদকার প্রকৃত হকদারগণ",
          budgetItems: ["সরাসরি নগদ/সামগ্রী বিতরণ", "যাচাই-বাছাই ব্যবস্থাপনা", "বিতরণ কার্যক্রম পরিচালনা"],
          area: "নির্ধারিত এলাকার হকদার পরিবার",
          duration: "বার্ষিক ও চলমান প্রকল্প",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "yatim-talibe-ilm-o-daridro",
          title: "ইয়াতীম, তালিবে ইলম ও দরিদ্র সহায়তা",
          blurb: "ইয়াতিম ও গরিব তালিবুল ইলমের পৃষ্ঠপোষকতা এবং দরিদ্র-মিসকিনদের সহযোগিতা।",
          description:
            "ইয়াতিম ও গরিব তালিবুল ইলমদের শিক্ষা ও ভরণপোষণের দায়িত্ব নিয়ে তাদের পৃষ্ঠপোষকতা করা হয়, পাশাপাশি সমাজের দরিদ্র ও মিসকিন মানুষদের প্রয়োজন অনুযায়ী সহযোগিতা প্রদান করা হয়।",
          support: {
            title: "ইয়াতীম, তালিবে ইলম ও দরিদ্র মানুষের পাশে দাঁড়ান",
            body:
              "ইয়াতিম ও গরিব তালিবুল ইলমদের শিক্ষা ও ভরণপোষণের ব্যয়, নিয়মিত মাসিক সহায়তা এবং দরিদ্র ও মিসকিনদের জরুরি প্রয়োজন মেটানোর জন্য নিয়মিত আর্থিক সহযোগিতা প্রয়োজন।\n\nআপনার অনুদান একজন ইয়াতিম শিশুর শিক্ষা, একজন তালিবুল ইলমের ভরণপোষণ কিংবা একটি দরিদ্র পরিবারের প্রয়োজন পূরণে সহায়ক হতে পারে।\n\n**আসুন, এই দীর্ঘমেয়াদী প্রকল্পে আমরা একসঙ্গে শরিক হই। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "ইয়াতিম শিক্ষার্থীদের পৃষ্ঠপোষকতা",
            "তালিবুল ইলমদের ভরণপোষণে সহায়তা",
            "দরিদ্র ও মিসকিনদের প্রয়োজন অনুযায়ী সহযোগিতা",
          ],
          targetAudience: "ইয়াতিম শিশু, তালিবুল ইলম ও দরিদ্র পরিবার",
          budgetItems: ["শিক্ষা ও ভরণপোষণ ব্যয়", "নিয়মিত মাসিক সহায়তা", "জরুরি প্রয়োজনে সহায়তা"],
          area: "নির্ধারিত এলাকার উপকারভোগী পরিবার",
          duration: "দীর্ঘমেয়াদী ও চলমান প্রকল্প",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "tube-well-o-jonokollan",
          title: "টিউবওয়েল ও জনকল্যাণমূলক প্রকল্প",
          blurb: "বিশুদ্ধ পানির সংকট নিরসনে টিউবওয়েল স্থাপন ও অন্যান্য জনকল্যাণমূলক উদ্যোগ।",
          description:
            "নিরাপদ ও বিশুদ্ধ পানির সংকট নিরসনে প্রয়োজনীয় এলাকায় টিউবওয়েল স্থাপন করা হয়, পাশাপাশি এলাকাবাসীর প্রয়োজন অনুযায়ী অন্যান্য জনকল্যাণমূলক কার্যক্রম পরিচালিত হয়।",
          support: {
            title: "আপনার সহযোগিতায় পৌঁছাবে নিরাপদ ও বিশুদ্ধ পানি",
            body:
              "পানির সংকটপূর্ণ এলাকায় টিউবওয়েল স্থাপনের সামগ্রী, শ্রমিক ও স্থাপনা খরচ, রক্ষণাবেক্ষণ এবং এলাকাবাসীর প্রয়োজন অনুযায়ী অন্যান্য জনকল্যাণমূলক কার্যক্রমের জন্য আর্থিক সহযোগিতা প্রয়োজন।\n\nআপনার অনুদানে স্থাপিত একটি টিউবওয়েল এলাকাবাসীর বিশুদ্ধ পানির প্রয়োজন মেটাতে পারে, যার সওয়াব ইনশাআল্লাহ আপনার জন্য সদকায়ে জারিয়া হয়ে থাকতে পারে।\n\n**আসুন, বিশুদ্ধ পানির সংকট নিরসনের এই উদ্যোগে আমরা একসঙ্গে শরিক হই। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "বিশুদ্ধ পানির সংকট নিরসন",
            "প্রয়োজন অনুযায়ী টিউবওয়েল স্থাপন",
            "জনকল্যাণমূলক অন্যান্য উদ্যোগ গ্রহণ",
          ],
          targetAudience: "পানির সংকটে থাকা এলাকাবাসী",
          budgetItems: ["টিউবওয়েল স্থাপন সামগ্রী", "শ্রমিক ও স্থাপনা খরচ", "রক্ষণাবেক্ষণ"],
          area: "পানির সংকটপূর্ণ নির্ধারিত এলাকা",
          duration: "প্রয়োজন ভিত্তিক প্রকল্প",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "brikkhoropon",
          title: "বৃক্ষরোপণ ও পরিবেশবান্ধব কার্যক্রম",
          blurb: "পরিবেশ সুরক্ষা ও সবুজায়নে বৃক্ষরোপণ কর্মসূচি পরিচালনা।",
          description:
            "পরিবেশ সুরক্ষা ও সবুজ প্রকৃতি গড়ে তুলতে বিভিন্ন এলাকায় বৃক্ষরোপণ কর্মসূচি পরিচালনা করা হয়, যা দীর্ঘমেয়াদে পরিবেশের ভারসাম্য রক্ষা ও জনসচেতনতা বৃদ্ধিতে ভূমিকা রাখে।",
          support: {
            title: "আপনার সহযোগিতায় গড়ে উঠুক সবুজ প্রকৃতি",
            body:
              "বিভিন্ন এলাকায় বৃক্ষরোপণ কর্মসূচির জন্য চারা গাছ ক্রয়, পরিবহন ও রোপণ ব্যবস্থাপনা এবং রোপিত গাছের পরিচর্যা ও রক্ষণাবেক্ষণে আর্থিক সহযোগিতা প্রয়োজন।\n\nআপনার অনুদানে রোপিত গাছ দীর্ঘমেয়াদে পরিবেশের ভারসাম্য রক্ষা ও জনসচেতনতা বৃদ্ধিতে ভূমিকা রাখতে পারে।\n\n**আসুন, পরিবেশ সুরক্ষা ও সবুজায়নের এই উদ্যোগে আমরা একসঙ্গে শরিক হই। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "পরিবেশ সুরক্ষা ও সবুজায়ন",
            "বৃক্ষরোপণে জনসচেতনতা বৃদ্ধি",
            "টেকসই পরিবেশবান্ধব উদ্যোগ গ্রহণ",
          ],
          targetAudience: "স্থানীয় জনসাধারণ ও পরিবেশ",
          budgetItems: ["চারা গাছ ক্রয়", "পরিবহন ও রোপণ ব্যবস্থাপনা", "পরিচর্যা ও রক্ষণাবেক্ষণ"],
          area: "নির্ধারিত এলাকার রাস্তা ও উন্মুক্ত জায়গা",
          duration: "বার্ষিক ও চলমান প্রকল্প",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "free-chikitsha-o-manobik-sahajjo",
          title: "ফ্রি চিকিৎসা ও মানবিক সহায়তা",
          blurb: "প্রয়োজনে ফ্রি চিকিৎসা সেবা ও মানবিক সহায়তা প্রদান।",
          description:
            "আর্থিকভাবে অসচ্ছল মানুষদের জন্য ফ্রি চিকিৎসা সেবার ব্যবস্থা করা হয় এবং দুর্যোগ বা জরুরি পরিস্থিতিতে প্রয়োজনীয় মানবিক সহায়তা প্রদান করা হয়।",
          support: {
            title: "অসুস্থ ও দুর্গত মানুষের পাশে দাঁড়ান",
            body:
              "আর্থিকভাবে অসচ্ছল রোগীদের চিকিৎসা ও ঔষধের খরচ, মেডিকেল ক্যাম্প আয়োজন এবং দুর্যোগ বা জরুরি পরিস্থিতিতে ত্রাণ সামগ্রীর জন্য আর্থিক সহযোগিতা প্রয়োজন।\n\nআপনার অনুদান একজন অসচ্ছল রোগীর চিকিৎসায় কিংবা দুর্যোগে ক্ষতিগ্রস্ত মানুষের প্রয়োজন পূরণে সহায়ক হতে পারে।\n\n**আসুন, বিপদের সময় মানুষের পাশে দাঁড়ানোর এই উদ্যোগে আমরা একসঙ্গে শরিক হই। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "আর্থিকভাবে অসচ্ছলদের ফ্রি চিকিৎসা সেবা",
            "জরুরি পরিস্থিতিতে মানবিক সহায়তা",
            "স্বাস্থ্যসচেতনতামূলক কার্যক্রম",
          ],
          targetAudience: "আর্থিকভাবে অসচ্ছল রোগী ও দুর্গতরা",
          budgetItems: ["চিকিৎসা ও ঔষধ খরচ", "মেডিকেল ক্যাম্প আয়োজন", "জরুরি ত্রাণ সামগ্রী"],
          area: "নির্ধারিত এলাকার অসচ্ছল পরিবার",
          duration: "প্রয়োজন ভিত্তিক ও চলমান প্রকল্প",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "masjid-madrasa-nirman",
          title: "মসজিদ-মাদরাসা নির্মাণে সহযোগিতা",
          blurb: "মসজিদ ও মাদরাসা নির্মাণ ও সংস্কারে আর্থিক সহযোগিতা প্রদান।",
          description:
            "বিভিন্ন এলাকায় মসজিদ ও মাদরাসা নির্মাণ কিংবা সংস্কার কাজে আর্থিক সহযোগিতা প্রদান করা হয়, যাতে দ্বীনি শিক্ষা ও ইবাদতের সুষ্ঠু পরিবেশ নিশ্চিত করা যায়।",
          support: {
            title: "ইবাদত ও দ্বীনি শিক্ষার পরিবেশ গড়তে এগিয়ে আসুন",
            body:
              "বিভিন্ন এলাকায় মসজিদ ও মাদরাসা নির্মাণ ও সংস্কারের সামগ্রী, শ্রমিক ব্যয় এবং তদারকি ব্যবস্থাপনার জন্য আর্থিক সহযোগিতা প্রয়োজন।\n\nআপনার অনুদান ইবাদত ও দ্বীনি শিক্ষার সুষ্ঠু পরিবেশ নিশ্চিত করতে ভূমিকা রাখতে পারে, যার সওয়াব ইনশাআল্লাহ আপনার জন্য সদকায়ে জারিয়া হয়ে থাকতে পারে।\n\n**আসুন, মসজিদ ও মাদরাসা নির্মাণ ও সংস্কারের এই উদ্যোগে আমরা একসঙ্গে শরিক হই। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "মসজিদ-মাদরাসা নির্মাণে আর্থিক সহায়তা",
            "প্রয়োজনীয় সংস্কার কাজে সহযোগিতা",
            "দ্বীনি শিক্ষার পরিবেশ উন্নয়ন",
          ],
          targetAudience: "স্থানীয় মসজিদ ও মাদরাসা কমিটি",
          budgetItems: ["নির্মাণ ও সংস্কার সামগ্রী", "শ্রমিক ব্যয়", "তদারকি ব্যবস্থাপনা"],
          area: "চিহ্নিত মসজিদ-মাদরাসা এলাকা",
          duration: "প্রয়োজন ভিত্তিক প্রকল্প",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "punorbashon-o-kormosangsthan",
          title: "পুনর্বাসন ও কর্মসংস্থান সহায়তা",
          blurb: "দুস্থ ও অসহায়দের ঘর নির্মাণ, গৃহপালিত পশু বিতরণ ও কর্মসংস্থানের ব্যবস্থা।",
          description:
            "দুস্থ, দরিদ্র ও অসহায় মানুষদের প্রয়োজন অনুযায়ী ঘর নির্মাণ, গৃহপালিত পশু বিতরণ এবং কর্মসংস্থানের ব্যবস্থা করে তাদের স্বাবলম্বী হতে সহায়তা করা হয়।",
          support: {
            title: "একটি অসহায় পরিবারকে স্বাবলম্বী হতে সহায়তা করুন",
            body:
              "দুস্থ, দরিদ্র ও অসহায় পরিবারের জন্য ঘর নির্মাণ সামগ্রী, গৃহপালিত পশু ক্রয় এবং কর্মসংস্থান প্রশিক্ষণ ও সহায়তার জন্য আর্থিক সহযোগিতা প্রয়োজন।\n\nআপনার অনুদান একটি পরিবারের ঘর নির্মাণে কিংবা তাদের জীবিকার ব্যবস্থায় সহায়ক হয়ে তাদের স্বাবলম্বী হওয়ার পথ সহজ করতে পারে।\n\n**আসুন, অসহায় মানুষকে স্বাবলম্বী করার এই উদ্যোগে আমরা একসঙ্গে শরিক হই। আল্লাহ তাআলা আমাদের সকলের প্রচেষ্টাকে কবুল করুন এবং উত্তম প্রতিদান দান করুন। আমিন।**",
          },
          objectives: [
            "প্রয়োজন অনুযায়ী ঘর নির্মাণ",
            "গৃহপালিত পশু বিতরণের মাধ্যমে স্বাবলম্বীকরণ",
            "কর্মসংস্থানের সুযোগ সৃষ্টি",
          ],
          targetAudience: "দুস্থ, দরিদ্র ও অসহায় পরিবার",
          budgetItems: ["ঘর নির্মাণ সামগ্রী", "গৃহপালিত পশু ক্রয়", "কর্মসংস্থান প্রশিক্ষণ ও সহায়তা"],
          area: "নির্ধারিত এলাকার উপকারভোগী পরিবার",
          duration: "দীর্ঘমেয়াদী ও চলমান প্রকল্প",
          faq: PROJECT_FAQ_BN,
        },
      ],
      closingNote:
        "এছাড়াও সাদাকা/সাদাকায়ে জারিয়ার মধ্যে পড়ে এমন সকল প্রকল্প ভবিষ্যতে পরিচালিত হবে, ইনশাআল্লাহ।",
      supportCta: "এই প্রকল্পে অনুদান দিন",
      ctaTitle: "আপনার অনুদান বদলে দিতে পারে একটি জীবন",
      ctaBody:
        "সাদাকা/সাদাকায়ে জারিয়ার মাধ্যমে আমাদের প্রকল্পে শরিক হোন — বিকাশ, নগদ অথবা সরাসরি যোগাযোগ করে অনুদান পাঠাতে পারেন।",
      ctaButton: "এখনই অনুদান দিন",
      detailsButton: "বিস্তারিত দেখুন",
    },
    projectDetail: {
      backToProjects: "সকল প্রকল্প দেখুন",
      descriptionTitle: "কার্যক্রমের বিবরণ",
      objectivesTitle: "প্রকল্পের লক্ষ্য-উদ্দেশ্য",
      audienceTitle: "উপকারভোগী",
      budgetTitle: "ব্যয়ের খাত",
      areaTitle: "প্রকল্পের এলাকা",
      durationTitle: "মেয়াদ",
      galleryTitle: "গ্যালারি",
      galleryComingSoon: "এই প্রকল্পের ছবি ও ভিডিও শীঘ্রই যুক্ত হবে।",
      impactTitle: "ইমপ্যাক্ট পরিসংখ্যান",
      impactComingSoon: "এই প্রকল্পের পরিসংখ্যান শীঘ্রই যুক্ত হবে।",
      faqTitle: "সাধারণ জিজ্ঞাসা",
      notFoundTitle: "প্রকল্পটি খুঁজে পাওয়া যায়নি",
      notFoundBody: "আপনি যে প্রকল্পটি খুঁজছেন তা পাওয়া যায়নি। সকল প্রকল্প দেখতে নিচের বাটনে ক্লিক করুন।",
    },
    gallery: {
      title: "আমাদের গ্যালারি",
      intro: "আমাদের কার্যক্রমের ছবি, ভিডিও এবং ইউটিউব প্লেলিস্ট দেখুন।",
      tabMedia: "ছবি ও ভিডিও",
      tabYoutube: "ইউটিউব প্লেলিস্ট",
      emptyMediaMessage: "এই মুহূর্তে কোনো ছবি বা ভিডিও নেই। পরে আবার দেখুন।",
      emptyYoutubeMessage: "এই মুহূর্তে কোনো প্লেলিস্ট পাওয়া যায়নি।",
      loadMore: "আরও দেখুন",
      loadingMore: "লোড হচ্ছে...",
      loadMoreError: "লোড করা যায়নি। আবার চেষ্টা করুন।",
      watchOnYoutube: "ইউটিউবে দেখুন",
      playlistVideoCount: "{count}টি ভিডিও",
    },
    activities: {
      title: "আমাদের কার্যক্রম",
      intro:
        "আমাদের সাম্প্রতিক কার্যক্রম ও আয়োজনের প্রতিবেদন পড়ুন। বিস্তারিত পড়তে যেকোনো লেখায় ক্লিক করুন।",
      readMore: "বিস্তারিত পড়ুন",
      emptyMessage: "এই মুহূর্তে কোনো প্রতিবেদন পাওয়া যায়নি। পরে আবার দেখুন।",
      visitBlog: "আমাদের ব্লগ দেখুন",
      loadMore: "আরও দেখুন",
      loadingMore: "লোড হচ্ছে...",
      loadMoreError: "লোড করা যায়নি। আবার চেষ্টা করুন।",
    },
    contact: {
      title: "যোগাযোগ করুন",
      intro: "সাদাকা/সাদাকায়ে জারিয়ামূলক কার্যক্রমে আপনার সহযোগিতা ও পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন।",
      officeLabel: "কার্যালয়",
      office: "আনন্দবাজার, মুকুন্দপুর, কোচাশহর, গোবিন্দগঞ্জ।",
      phoneLabel: "যোগাযোগ ও অনুদান পাঠাতে",
      phoneNote: "(বিকাশ, নগদ)",
      emailLabel: "ইমেইল",
      donationTitle: "অনুদান পাঠানোর মাধ্যম",
      donationBody:
        "বিকাশ ও নগদের মাধ্যমে উপরের নম্বরে সরাসরি অনুদান পাঠাতে পারেন। যেকোনো জিজ্ঞাসার জন্য ইমেইল বা ফোনে যোগাযোগ করুন।",
      socialTitle: "আমাদের প্রচার মাধ্যম",
      form: {
        title: "আমাদের বার্তা পাঠান",
        intro: "নিচের ফর্মটি পূরণ করুন, আমরা যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করব।",
        nameLabel: "নাম",
        namePlaceholder: "আপনার পূর্ণ নাম",
        emailLabel: "ইমেইল",
        emailPlaceholder: "আপনার ইমেইল ঠিকানা",
        phoneLabel: "ফোন (ঐচ্ছিক)",
        phonePlaceholder: "আপনার ফোন নম্বর",
        messageLabel: "বার্তা",
        messagePlaceholder: "আপনার বার্তা লিখুন...",
        submit: "বার্তা পাঠান",
        submitting: "পাঠানো হচ্ছে...",
        successMessage: "ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে — আমরা শীঘ্রই যোগাযোগ করব।",
        errorMessage: "দুঃখিত, বার্তা পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
      },
    },
    footer: {
      tagline: "আস্-সালসাবিল ফাউন্ডেশন — সাদাকায়ে জারিয়ামূলক কার্যক্রম, প্রতিষ্ঠিত ২০২১।",
      rights: "সর্বস্বত্ব সংরক্ষিত।",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      projects: "Our Projects",
      activities: "Our Activities",
      contact: "Contact Us",
      brand: "As-Salsabil Foundation",
    },
    home: {
      heroEyebrow: "Established 2021",
      heroTitle: "As-Salsabil Foundation",
      heroSubtitle:
        "Mukundapur (Kanaipara), Kochashahar, Gobindaganj, Gaibandha — serving the faith and humanity through ongoing charitable (sadaqah jariyah) work",
      heroQuote:
        "“Those who recite the Book of Allah, establish prayer, and spend out of what We have provided for them, secretly and openly, can hope for a trade that will never perish.”",
      heroQuoteSource: "Surah Fatir, Verse 29",
      ctaAbout: "Learn About Us",
      ctaProjects: "Our Projects",
      ctaContact: "Get in Touch",
      introTitle: "Introduction",
      introBody:
        "Taking the verse above as its motto, As-Salsabil Foundation was established in February 2021. Following the Sunnah and guidance of the Prophet (peace be upon him), it runs ongoing charitable (sadaqah jariyah) projects, and its work is entirely non-political.",
      aboutLink: "Learn more about us",
      projectsTitle: "Our Projects",
      projectsIntro: "Some of our ongoing and planned work, from Islamic education to the welfare of humanity.",
      projectsViewAll: "View all projects",
      activitiesTitle: "Recent Activities",
      activitiesIntro: "The latest reports from our work and events.",
      activitiesViewAll: "View all activities",
      supportWays: ["Dua", "Advice", "Volunteering", "Financial support"],
      donateLabel: "bKash / Nagad",
    },
    about: {
      title: "About Us",
      introTitle: "Who We Are",
      intro: [
        "The greatest achievement of a human life is earning the pleasure of Allah. Taking part in good works whose benefit continues among people for a long time can be an important means of gathering provision for the Hereafter.",
        "With this conviction, As-Salsabil Foundation was established in February 2021. Following the guidance of the Holy Qur'an and the authentic Sunnah, our commitment is to spread Islamic education, carry out dawah on sound aqeedah and manhaj, support people in need, and run public-welfare sadaqah jariyah work.",
        "We believe that sound teaching of the deen and sincere effort for the good of people can help build a beautiful, aware and caring society. Alhamdulillah, our work is carried out toward this goal.",
      ],
      missionTitle: "Our Aim & Objectives",
      missionBody:
        "To earn the pleasure of Allah by spreading Islamic knowledge in the light of the Qur'an and Sunnah, calling to sound aqeedah and authentic manhaj, and carrying out long-lasting projects for the welfare of humanity.",
      nameTitle: "The Meaning of Salsabil",
      nameBody:
        "Salsabil is a spring in Paradise. Alongside obligatory worship, sadaqah jariyah (ongoing charity) is a deed whose reward keeps reaching a person even after death.",
      valuesTitle: "Our Principles",
      values: [
        {
          title: "Following the Prophet's Sunnah",
          body: "Every program follows the Sunnah and guidance of the Prophet Muhammad (peace be upon him).",
        },
        {
          title: "Non-political",
          body: "All of the Foundation's charitable and sadaqah jariyah work is carried out with a strictly non-political outlook.",
        },
        {
          title: "Transparent stewardship",
          body: "Sadaqah and sadaqah jariyah funds are directed correctly and responsibly to their intended purpose.",
        },
      ],
      projectsTitle: "Our Ongoing & Planned Projects",
      projects: [
        {
          title: "Zakat, Sadaqah & Poverty Relief",
          points: [
            "Distributing zakat to its Shariah-approved recipients",
            "Supporting the poor, the helpless and the needy",
            "Sponsoring orphans and students of knowledge from poor families",
          ],
        },
        {
          title: "Islamic Education & Dawah",
          points: [
            "Mosque-based Qur'an and Islamic education for children and adults",
            "Qur'an and Islamic education for women",
            "Islamic lessons, seminars and educational programs",
            "Dawah based on sound aqeedah and authentic manhaj",
            "Publishing and distributing Islamic books, leaflets and dawah materials",
          ],
        },
        {
          title: "Mosques, Madrasas & Islamic Institutions",
          points: [
            "Supporting the construction of mosques and madrasas",
            "Expanding Islamic education and library programs",
            "Distributing Islamic books and study materials free of charge",
          ],
        },
        {
          title: "Water, Medical Care & Environment",
          points: [
            "Providing safe water by installing tube wells",
            "Free medical care programs",
            "Tree planting and eco-friendly initiatives",
          ],
        },
        {
          title: "Rehabilitation & Employment",
          points: [
            "Needs-based support for sick, poor and helpless families",
            "Helping to build homes, according to need and available means",
            "Distributing livestock and helping to create work opportunities",
            "One-time assistance in urgent need",
          ],
        },
      ],
      projectsNote:
        "Other charitable work that falls under sadaqah and sadaqah jariyah will also be carried out according to our means and the need, insha'Allah.",
      supportTitle: "With Your Support, This Work of Goodness Moves Forward",
      supportBody: [
        "One sincere contribution can support someone's Islamic education, bring relief to a family in need, or help a long-lasting charitable effort.",
        "Let us stand together to carry the foundation's Islamic and humanitarian work forward through dua, advice, volunteering and financial support.",
      ],
      supportDua:
        "May Allah accept the good deeds of us all, bless our charity, and accept this effort as a means of earning His pleasure. Ameen.",
      supportTagline: "For the service of the deen and the welfare of humanity: a sincere commitment.",
      ctaProjects: "See Our Projects",
      ctaContact: "Get in Touch",
      brochureTitle: "Our Brochure",
      brochureBody: "An introduction to the foundation and its projects on one page (in Bengali).",
      brochureView: "View PDF",
      brochureDownload: "Download",
    },
    projects: {
      title: "Our Planned Projects",
      intro:
        "Following the guidance of the Qur'an and the Sunnah of the Prophet (peace be upon him), As-Salsabil Foundation works across several areas of sadaqah and sadaqah jariyah.",
      categories: [
        {
          slug: "deeni-shiksha-o-dawah",
          title: "Islamic Education & Dawah",
          blurb: "Religious classes, Islamic seminars, and dawah programs spreading correct Islamic knowledge.",
          description:
            "Alhamdulillah! Since its founding, As-Salsabil Foundation has worked to spread pure knowledge of the deen in the light of the Holy Qur'an and the authentic Sunnah, to carry out dawah activities, and to establish Islamic values in society.\n\n**Since 2021, our dawah journey has continued steadily through regular monthly ta'limi gatherings.** These gatherings offer discussions based on the Qur'an and Sunnah, sound aqeedah, authentic manhaj, self-purification, righteous deeds and character, and guidance on contemporary religious and social issues.\n\nAlongside the regular monthly ta'limi gatherings, we continue to carry the message of the deen to a wider audience each year through the **Sudhi Somabesh (Gathering of Well-Wishers) and the Salsabil Conference**. These events aim to awaken religious awareness, mutual brotherhood and Islamic values among scholars, religious figures, students, the youth, and devout people from all walks of life.",
          highlights: {
            title: "Highlights of Our Dawah Activities",
            items: [
              "Organizing regular monthly ta'limi gatherings and religious discussions.",
              "Holding the Sudhi Somabesh and the annual Salsabil Conference every year.",
              "Spreading pure knowledge based on the Qur'an and authentic Sunnah.",
              "Raising awareness of sound aqeedah and authentic manhaj.",
              "Increasing religious awareness among the youth and the general public.",
              "Sharing religious talks and educational content on social media and online platforms.",
              "Promoting Islamic values, brotherhood and welfare-oriented activities in society.",
            ],
          },
          support: {
            title: "Your Support Will Carry Our Journey Forward",
            body:
              "Regular financial support is needed to run these ongoing dawah activities, organize the monthly ta'limi gatherings, hold the annual Sudhi Somabesh and Salsabil Conference, and expand our dawah work further.\n\nWe believe your sincere participation in this effort to spread correct knowledge of the deen and share the beauty of Islam with people can be a valuable contribution.\n\n**Come, let us work together to spread and uphold the deen. Become a partner in this noble initiative through your voluntary financial support and sincere participation. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Spread Islamic knowledge based on correct aqeedah and manhaj",
            "Hold regular monthly ta'limi gatherings, ongoing since 2021",
            "Organize the Sudhi Somabesh and Salsabil Conference every year",
            "Share educational content on social media and online platforms",
          ],
          targetAudience: "Scholars, students, the youth, and devout people from all walks of life",
          budgetItems: [
            "Running costs of the monthly ta'limi gatherings",
            "Hosting the annual Sudhi Somabesh and Salsabil Conference",
            "Honorarium for speakers and teachers",
            "Online content and promotional materials",
          ],
          area: "Locations as needed, and online",
          duration: "Regular, ongoing program since 2021",
          faq: PROJECT_FAQ_EN,
        },
        {
          slug: "quran-o-deeni-shikkhadan",
          title: "Qur'an & Islamic Teaching",
          blurb: "Mosque-based Qur'an and Islamic education for elders and women.",
          description:
            "Under As-Salsabil Foundation's supervision, the Maktab education program already runs **20+ maktabs across the area.** These maktabs teach children, teenagers, and students of all ages **Qur'an, Aqidah, and essential Islamic knowledge grounded in correct religious understanding and sound methodology (manhaj).** To improve and expand this program, **there are plans to launch dedicated training for teachers to sharpen their skills and teaching quality, along with the necessary guidelines** — to be rolled out as sufficient funding is secured. Today, **around 300+ students** — young and old, men and women — have all of their education costs and course fees covered completely free of charge. Students are also given **free Qur'ans and the study materials they need.** Participation in this Islamic education program is open to everyone, entirely free. Even your small contribution can help support a child's journey in Islamic education — a good deed whose reward, in sha Allah, may continue for you as an ongoing **sadaqah jariyah.**",
          support: {
            title: "Your Support Will Carry This Journey of Islamic Learning Forward",
            body:
              "Regular financial support is needed to keep free education running for 300+ students across 20+ maktabs, provide teacher honorariums, distribute Qur'ans and study materials, and launch teacher training and guidelines.\n\nEven a small donation can ease a student's path in learning the Qur'an and the deen — a good deed whose reward, in sha Allah, may continue for you as an ongoing sadaqah jariyah.\n\n**Come, let us take part together in this work of Qur'an and Islamic education. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Teach correct Qur'an recitation",
            "Separate classes for women",
            "Regular mosque-based sessions",
            "Teacher training and guidelines to raise teaching quality",
          ],
          targetAudience: "Students of all ages, including children and teenagers, men and women",
          budgetItems: ["Teacher honorariums", "Learning materials", "Teacher quality development"],
          area: "Mosque-based, designated areas",
          duration: "Ongoing, regular program",
          faq: PROJECT_FAQ_EN,
          impactStats: [
            { value: "20+", label: "Maktabs running" },
            { value: "300+", label: "Students benefited" },
            { value: "100%", label: "Free of charge" },
          ],
        },
        {
          slug: "islami-pathagar-o-prokashona",
          title: "Islamic Library & Publications",
          blurb: "Establishing Islamic libraries and distributing free books based on correct aqeedah.",
          description:
            "Islamic libraries grounded in correct aqeedah and manhaj are set up in various mosques, and free Islamic books, leaflets, and dua charts are published and distributed to help people easily access authentic religious knowledge.",
          support: {
            title: "Your Support Will Carry Authentic Knowledge to More People",
            body:
              "Financial support is needed to set up Islamic libraries grounded in correct aqeedah and manhaj in various mosques, and to print and distribute free Islamic books, leaflets, and dua charts.\n\nEven one book or leaflet published through your donation can make it easier for someone to gain knowledge of the deen — a good deed whose reward, in sha Allah, may continue for you as an ongoing sadaqah jariyah.\n\n**Come, let us take part together in spreading authentic religious knowledge. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Set up mosque-based libraries",
            "Distribute free Islamic books and leaflets",
            "Publish dua charts",
          ],
          targetAudience: "Worshippers and general readers",
          budgetItems: ["Printing books and leaflets", "Library furnishing", "Distribution logistics"],
          area: "Designated mosque-based areas",
          duration: "Ongoing project",
          faq: PROJECT_FAQ_EN,
        },
        {
          slug: "zakat-o-sadaka",
          title: "Zakat & Sadaqah Projects",
          blurb: "Prioritized, accurate distribution of zakat across the 8 categories described in the Qur'an.",
          description:
            "Following the 8 categories of zakat recipients described in the Qur'an, zakat and sadaqah funds are distributed accurately and on a priority basis to those who are entitled.",
          support: {
            title: "Let Your Zakat & Sadaqah Reach Those Truly Entitled",
            body:
              "This project follows the 8 categories of zakat recipients described in the Qur'an, verifying genuine recipients, setting priorities, and distributing funds transparently and accountably.\n\nYour zakat and sadaqah are distributed as cash or needed goods among eligible families in designated areas.\n\n**Come, let us stand beside those who are entitled through our zakat and sadaqah. May Allah accept the giving of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Distribute zakat correctly across its 8 categories",
            "Verify genuine recipients and set priorities",
            "Transparent, accountable implementation",
          ],
          targetAudience: "Verified recipients of zakat and sadaqah",
          budgetItems: ["Direct cash/goods distribution", "Verification process", "Distribution logistics"],
          area: "Eligible families in designated areas",
          duration: "Annual, ongoing project",
          faq: PROJECT_FAQ_EN,
        },
        {
          slug: "yatim-talibe-ilm-o-daridro",
          title: "Support for Orphans, Students of Knowledge & the Poor",
          blurb: "Sponsoring orphans and poor students of Islamic knowledge, and supporting the poor and needy.",
          description:
            "Orphans and poor students of Islamic knowledge are sponsored for their education and upkeep, while poor and needy members of society receive support according to their needs.",
          support: {
            title: "Stand Beside Orphans, Students of Knowledge & the Poor",
            body:
              "Regular financial support is needed to cover the education and upkeep of orphans and poor students of Islamic knowledge, provide regular monthly assistance, and meet the urgent needs of the poor and needy.\n\nYour donation can help with an orphan's education, a student of knowledge's upkeep, or the needs of a poor family.\n\n**Come, let us take part together in this long-term project. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Sponsor orphaned students",
            "Support upkeep of students of knowledge",
            "Assist poor and needy families as needed",
          ],
          targetAudience: "Orphaned children, students of knowledge, and poor families",
          budgetItems: ["Education and upkeep costs", "Regular monthly support", "Emergency assistance"],
          area: "Beneficiary families in designated areas",
          duration: "Long-term, ongoing project",
          faq: PROJECT_FAQ_EN,
        },
        {
          slug: "tube-well-o-jonokollan",
          title: "Tube Wells & Public Welfare Projects",
          blurb: "Installing tube wells to resolve safe drinking water shortages, and other welfare initiatives.",
          description:
            "Tube wells are installed in areas facing a shortage of safe drinking water, alongside other public welfare initiatives as needed by local communities.",
          support: {
            title: "Your Support Can Bring Safe, Clean Water",
            body:
              "Financial support is needed for tube well materials, labor and installation, maintenance, and other welfare initiatives according to local needs in water-scarce areas.\n\nA tube well installed through your donation can help meet a community's need for safe drinking water — a good deed whose reward, in sha Allah, may continue for you as an ongoing sadaqah jariyah.\n\n**Come, let us take part together in easing water shortages. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Resolve safe drinking water shortages",
            "Install tube wells where needed",
            "Undertake other welfare initiatives",
          ],
          targetAudience: "Communities facing water shortages",
          budgetItems: ["Tube well installation materials", "Labor and installation costs", "Maintenance"],
          area: "Designated water-scarce areas",
          duration: "As-needed project",
          faq: PROJECT_FAQ_EN,
        },
        {
          slug: "brikkhoropon",
          title: "Tree Plantation & Eco-Friendly Activities",
          blurb: "Tree plantation drives for environmental protection and greening.",
          description:
            "Tree plantation drives are carried out in various areas to protect the environment and build a greener community, helping preserve ecological balance and raise public awareness over the long term.",
          support: {
            title: "Your Support Can Help Build a Greener Community",
            body:
              "Financial support is needed to buy saplings, manage transport and planting, and care for and maintain the trees planted during plantation drives in various areas.\n\nTrees planted through your donation can help preserve ecological balance and raise public awareness over the long term.\n\n**Come, let us take part together in protecting the environment and greening our communities. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Protect the environment and promote greening",
            "Raise public awareness on tree plantation",
            "Undertake sustainable eco-friendly initiatives",
          ],
          targetAudience: "Local communities and the environment",
          budgetItems: ["Purchasing saplings", "Transport and planting logistics", "Ongoing care and maintenance"],
          area: "Roadsides and open spaces in designated areas",
          duration: "Annual, ongoing project",
          faq: PROJECT_FAQ_EN,
        },
        {
          slug: "free-chikitsha-o-manobik-sahajjo",
          title: "Free Medical Care & Humanitarian Aid",
          blurb: "Providing free medical care and humanitarian assistance when needed.",
          description:
            "Free medical care is arranged for those who cannot afford it, and necessary humanitarian assistance is provided during emergencies or disasters.",
          support: {
            title: "Stand Beside the Sick and Those Affected by Disaster",
            body:
              "Financial support is needed for treatment and medicine for patients who cannot afford them, for organizing medical camps, and for relief supplies during disasters and emergencies.\n\nYour donation can help with a patient's treatment or meet the needs of people affected by disaster.\n\n**Come, let us take part together in standing beside people in their time of need. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Free medical care for those in financial need",
            "Humanitarian aid during emergencies",
            "Health-awareness programs",
          ],
          targetAudience: "Financially disadvantaged patients and disaster-affected people",
          budgetItems: ["Treatment and medicine costs", "Medical camp organization", "Emergency relief supplies"],
          area: "Underprivileged families in designated areas",
          duration: "As-needed, ongoing project",
          faq: PROJECT_FAQ_EN,
        },
        {
          slug: "masjid-madrasa-nirman",
          title: "Mosque & Madrasa Construction Support",
          blurb: "Financial support for building and renovating mosques and madrasas.",
          description:
            "Financial support is provided for constructing or renovating mosques and madrasas in various areas, helping ensure a proper environment for worship and Islamic education.",
          support: {
            title: "Help Build a Proper Environment for Worship and Learning",
            body:
              "Financial support is needed for construction and renovation materials, labor, and project oversight for mosques and madrasas in various areas.\n\nYour donation can help ensure a proper environment for worship and Islamic education — a good deed whose reward, in sha Allah, may continue for you as an ongoing sadaqah jariyah.\n\n**Come, let us take part together in building and renovating mosques and madrasas. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Financial support for mosque-madrasa construction",
            "Support for necessary renovation work",
            "Improve the environment for Islamic education",
          ],
          targetAudience: "Local mosque and madrasa committees",
          budgetItems: ["Construction and renovation materials", "Labor costs", "Project oversight"],
          area: "Identified mosque-madrasa locations",
          duration: "As-needed project",
          faq: PROJECT_FAQ_EN,
        },
        {
          slug: "punorbashon-o-kormosangsthan",
          title: "Rehabilitation & Employment Support",
          blurb: "Building homes, distributing livestock, and arranging employment for the destitute.",
          description:
            "Homes are built as needed for the destitute, poor, and helpless, alongside livestock distribution and employment arrangements to help them become self-reliant.",
          support: {
            title: "Help a Struggling Family Become Self-Reliant",
            body:
              "Financial support is needed for home construction materials, purchasing livestock, and employment training and support for destitute, poor, and helpless families.\n\nYour donation can help a family build a home or secure a livelihood, easing their path to self-reliance.\n\n**Come, let us take part together in helping those in need become self-reliant. May Allah accept the efforts of all of us and grant us the best reward. Ameen.**",
          },
          objectives: [
            "Build homes as needed",
            "Enable self-reliance through livestock distribution",
            "Create employment opportunities",
          ],
          targetAudience: "Destitute, poor, and helpless families",
          budgetItems: ["Home construction materials", "Purchasing livestock", "Employment training and support"],
          area: "Beneficiary families in designated areas",
          duration: "Long-term, ongoing project",
          faq: PROJECT_FAQ_EN,
        },
      ],
      closingNote:
        "God willing, every future project that falls under sadaqah/sadaqah jariyah will also be carried out under this Foundation.",
      supportCta: "Support This Project",
      ctaTitle: "Your Donation Can Change a Life",
      ctaBody:
        "Join our work through sadaqah or sadaqah jariyah — send your donation via bKash, Nagad, or get in touch with us directly.",
      ctaButton: "Donate Now",
      detailsButton: "View Details",
    },
    projectDetail: {
      backToProjects: "View All Projects",
      descriptionTitle: "Project Overview",
      objectivesTitle: "Goals & Objectives",
      audienceTitle: "Beneficiaries",
      budgetTitle: "Budget Areas",
      areaTitle: "Project Area",
      durationTitle: "Duration",
      galleryTitle: "Gallery",
      galleryComingSoon: "Photos and videos for this project are coming soon.",
      impactTitle: "Impact Statistics",
      impactComingSoon: "Statistics for this project are coming soon.",
      faqTitle: "Frequently Asked Questions",
      notFoundTitle: "Project Not Found",
      notFoundBody: "The project you're looking for could not be found. Click below to see all projects.",
    },
    gallery: {
      title: "Our Gallery",
      intro: "Browse photos, videos, and YouTube playlists from our activities.",
      tabMedia: "Photos & Videos",
      tabYoutube: "YouTube Playlists",
      emptyMediaMessage: "No photos or videos are available right now. Please check back later.",
      emptyYoutubeMessage: "No playlists are available right now.",
      loadMore: "Load More",
      loadingMore: "Loading...",
      loadMoreError: "Couldn't load more. Please try again.",
      watchOnYoutube: "Watch on YouTube",
      playlistVideoCount: "{count} videos",
    },
    activities: {
      title: "Our Activities",
      intro: "Read reports of our recent activities and events. Click any post to read the full story.",
      readMore: "Read More",
      emptyMessage: "No activity reports are available right now. Please check back later.",
      visitBlog: "Visit Our Blog",
      loadMore: "Load More",
      loadingMore: "Loading...",
      loadMoreError: "Couldn't load more. Please try again.",
    },
    contact: {
      title: "Contact Us",
      intro: "Reach out to us for cooperation, questions, or guidance on our sadaqah/sadaqah jariyah work.",
      officeLabel: "Office",
      office: "Anandabazar, Mukundapur, Kochashahar, Gobindaganj.",
      phoneLabel: "Contact & Donations",
      phoneNote: "(bKash, Nagad)",
      emailLabel: "Email",
      donationTitle: "How to Donate",
      donationBody:
        "You can send donations directly to the numbers above via bKash or Nagad. For any questions, reach us by email or phone.",
      socialTitle: "Follow Us",
      form: {
        title: "Send Us a Message",
        intro: "Fill out the form below and we'll get back to you as soon as possible.",
        nameLabel: "Name",
        namePlaceholder: "Your full name",
        emailLabel: "Email",
        emailPlaceholder: "Your email address",
        phoneLabel: "Phone (optional)",
        phonePlaceholder: "Your phone number",
        messageLabel: "Message",
        messagePlaceholder: "Write your message...",
        submit: "Send Message",
        submitting: "Sending...",
        successMessage: "Thank you! Your message has been sent — we'll be in touch soon.",
        errorMessage: "Sorry, we couldn't send your message. Please try again.",
      },
    },
    footer: {
      tagline: "As-Salsabil Foundation — ongoing charitable (sadaqah jariyah) work, established 2021.",
      rights: "All rights reserved.",
    },
  },
};

export const getDictionary = (language: Language): Dictionary => dictionaries[language];
