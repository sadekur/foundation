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
  pillars: { title: string; body: string }[];
}

export interface AboutDictionary {
  title: string;
  intro: string[];
  missionTitle: string;
  missionBody: string;
  values: { title: string; body: string }[];
}

export interface ProjectFaqItem {
  question: string;
  answer: string;
}

// `slug` is the language-independent routing key for /projects/[slug] (see PROJECT_CATEGORY_SLUGS
// below) — kept identical between the bn and en entry at the same array index. Every other field
// is real brochure-derived copy for the summary card; `description` through `faq` back the detail
// page and are placeholder/generic copy until the foundation supplies real per-project figures
// (objectives, budget, area, duration are safe generic statements — deliberately no invented
// numbers or stats, see `ProjectDetailDictionary`'s `impactComingSoon`/`galleryComingSoon`).
export interface ProjectCategory {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  budgetItems: string[];
  area: string;
  duration: string;
  faq: ProjectFaqItem[];
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
      pillars: [
        {
          title: "যাকাত প্রকল্প",
          body: "কুরআন মাজীদে বর্ণিত যাকাতের ৮টি খাতে অগ্রাধিকার ভিত্তিতে সঠিকভাবে বণ্টন।",
        },
        {
          title: "সাদাকায়ে জারিয়ামূলক প্রকল্প",
          body: "দ্বীনি শিক্ষা, ইয়াতিম ও গরিব তালিবুল ইলমের পৃষ্ঠপোষকতা, চিকিৎসা ও কূপ স্থাপন, মসজিদ-মাদরাসা নির্মাণ সহযোগিতা।",
        },
        {
          title: "পুনর্বাসন প্রকল্প",
          body: "দুস্থ ও অসহায়দের গৃহ নির্মাণ, গৃহপালিত পশু বিতরণ ও কর্মসংস্থানের ব্যবস্থা।",
        },
      ],
    },
    about: {
      title: "আমাদের সম্পর্কে",
      intro: [
        "সালসাবিল জান্নাতের একটি ঝর্ণাধারা। ফরজ ইবাদাত-আমলের পাশাপাশি সাদাকায়ে জারিয়াহ এমন একটি আমল, যার প্রতিদান মানুষ মৃত্যুর পরেও পেতে থাকে।",
        "এই প্রতিদান দুনিয়া ও আখিরাতে অর্জনের লক্ষ্যে ২০২১ সালের ফেব্রুয়ারি মাসে “আস্-সালসাবিল ফাউন্ডেশন” প্রতিষ্ঠিত হয়েছে, যার কার্যক্রম সম্পূর্ণ অ-রাজনৈতিক।",
      ],
      missionTitle: "লক্ষ্য ও উদ্দেশ্য",
      missionBody:
        "মৃত্যুর পরেও মানুষের আমলনামায় যুক্ত হবে এমন দীর্ঘস্থায়ী সাদাকায়ে জারিয়ামূলক প্রকল্প সামনে রেখে “আস্-সালসাবিল ফাউন্ডেশন” পরিচালিত হচ্ছে।",
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
            "কুরআন ও সুন্নাহ ভিত্তিক সঠিক আকিদা ও মানহাজ প্রচারের লক্ষ্যে আস্-সালসাবিল ফাউন্ডেশন নিয়মিত দ্বীনি দারস, ইসলামী সেমিনার ও দাওয়াহ কার্যক্রম পরিচালনা করে। সমাজের সর্বস্তরের মানুষের কাছে দ্বীনের সঠিক জ্ঞান পৌঁছে দেওয়াই এই প্রকল্পের মূল উদ্দেশ্য।",
          objectives: [
            "সহীহ আকিদা ও মানহাজ ভিত্তিক দ্বীনি শিক্ষার প্রসার",
            "নিয়মিত দারস ও সেমিনারের আয়োজন",
            "স্থানীয় পর্যায়ে দাওয়াহ কার্যক্রম সম্প্রসারণ",
          ],
          targetAudience: "সাধারণ মুসল্লি ও এলাকাবাসী",
          budgetItems: ["বক্তা ও শিক্ষকদের সম্মানী", "ভেন্যু ও আয়োজন ব্যবস্থাপনা", "প্রচার সামগ্রী"],
          area: "প্রয়োজন অনুযায়ী নির্ধারিত এলাকা",
          duration: "নিয়মিত ও চলমান কার্যক্রম",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "quran-o-deeni-shikkhadan",
          title: "কুরআন ও দ্বীনী শিক্ষাদান",
          blurb: "মসজিদ ভিত্তিক বয়স্ক ও মহিলাদের কুরআন ও দ্বীনি শিক্ষাদান কার্যক্রম।",
          description:
            "মসজিদ ভিত্তিক ব্যবস্থায় বয়স্কদের এবং পৃথকভাবে মহিলাদের কুরআন তিলাওয়াত ও দ্বীনি শিক্ষা প্রদান করা হয়, যাতে প্রত্যেকে সহীহভাবে কুরআন পড়তে ও দ্বীনের মৌলিক জ্ঞান অর্জন করতে পারেন।",
          objectives: [
            "সহীহভাবে কুরআন তিলাওয়াত শিক্ষাদান",
            "মহিলাদের জন্য পৃথক শিক্ষা ব্যবস্থা",
            "মসজিদ ভিত্তিক নিয়মিত ক্লাস পরিচালনা",
          ],
          targetAudience: "বয়স্ক পুরুষ ও মহিলা মুসল্লি",
          budgetItems: ["শিক্ষকদের সম্মানী", "শিক্ষা উপকরণ", "মসজিদ ব্যবস্থাপনা সহায়তা"],
          area: "মসজিদ ভিত্তিক নির্ধারিত এলাকা",
          duration: "নিয়মিত ও চলমান কার্যক্রম",
          faq: PROJECT_FAQ_BN,
        },
        {
          slug: "islami-pathagar-o-prokashona",
          title: "ইসলামী পাঠাগার ও প্রকাশনা",
          blurb: "বিশুদ্ধ আকিদা ভিত্তিক ইসলামী পাঠাগার স্থাপন ও ফ্রি বই-পুস্তক বিতরণ।",
          description:
            "বিভিন্ন মসজিদে বিশুদ্ধ আকিদা ও মানহাজ ভিত্তিক ইসলামী পাঠাগার স্থাপন করা হয় এবং ফ্রি ইসলামী বই, লিফলেট ও দোয়ার চার্ট প্রকাশনা ও বিতরণ করা হয়, যাতে সাধারণ মানুষ সহজে সঠিক দ্বীনি জ্ঞান অর্জন করতে পারেন।",
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
      pillars: [
        {
          title: "Zakat Project",
          body: "Correct, priority-based distribution of Zakat across the eight categories named in the Qur'an.",
        },
        {
          title: "Sadaqah Jariyah Projects",
          body: "Deeni education, support for orphan and poor students of Islamic knowledge, medical camps and tube-wells, and support for mosque/madrasa construction.",
        },
        {
          title: "Rehabilitation Project",
          body: "Housing for the distressed and poor, livestock distribution, and setting up livelihoods.",
        },
      ],
    },
    about: {
      title: "About Us",
      intro: [
        "Salsabil is a spring in Paradise. Alongside obligatory worship, sadaqah jariyah (ongoing charity) is a deed whose reward keeps reaching a person even after death.",
        "To pursue that reward in this life and the next, As-Salsabil Foundation was established in February 2021. Its work is entirely non-political.",
      ],
      missionTitle: "Aim & Objectives",
      missionBody:
        "As-Salsabil Foundation is run with long-lasting sadaqah jariyah projects in mind — ones that keep adding to a person's record of good deeds even after death.",
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
    },
    projects: {
      title: "Our Planned Projects",
      intro:
        "Following the guidance of the Qur'an and the Sunnah of the Prophet (peace be upon him), As-Salsabil Foundation works across three main areas.",
      categories: [
        {
          title: "Zakat Project",
          intro: "Correct, priority-based distribution of Zakat across the eight categories named in the Qur'an.",
          items: [],
        },
        {
          title: "Other Sadaqah Jariyah Projects",
          items: [
            "Mosque-based Qur'an and deeni education for elders",
            "Qur'an and deeni education for women",
            "Deen education through religious talks and Islamic seminars",
            "Setting up Islamic libraries (sound aqidah/manhaj) at various mosques and distributing free Islamic books and leaflets",
            "Sponsorship and mentorship for orphan and poor students of Islamic knowledge (talibul ilm)",
            "Support for the poor and needy",
            "Publishing deeni books and dua charts",
            "Free medical camps, tree plantation, and tube-well installation",
            "Support for mosque and madrasa construction",
          ],
        },
        {
          title: "Rehabilitation Project",
          items: [
            "Building homes for the distressed and poor as needed",
            "Distribution of livestock",
            "Setting up livelihoods/employment",
            "One-time emergency support as needed",
          ],
        },
      ],
      closingNote:
        "God willing, every future project that falls under sadaqah/sadaqah jariyah will also be carried out under this Foundation.",
      supportCta: "Support This Project",
      ctaTitle: "Your Donation Can Change a Life",
      ctaBody:
        "Join our work through sadaqah or sadaqah jariyah — send your donation via bKash, Nagad, or get in touch with us directly.",
      ctaButton: "Donate Now",
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
