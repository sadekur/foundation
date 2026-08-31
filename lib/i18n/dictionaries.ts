import type { Language } from "./LanguageProvider";

export interface NavDictionary {
  home: string;
  about: string;
  projects: string;
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

export interface ProjectCategory {
  title: string;
  intro?: string;
  items: string[];
}

export interface ProjectsDictionary {
  title: string;
  intro: string;
  categories: ProjectCategory[];
  closingNote: string;
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
  contact: ContactDictionary;
  footer: FooterDictionary;
}

export const dictionaries: Record<Language, Dictionary> = {
  bn: {
    nav: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      projects: "আমাদের প্রকল্প",
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
        "কুরআন মাজীদের নির্দেশনা ও রাসুলুল্লাহ (সা.) এর সুন্নাহ অনুসরণ করে আস্-সালসাবিল ফাউন্ডেশন তিনটি প্রধান খাতে কাজ করে।",
      categories: [
        {
          title: "যাকাত প্রকল্প",
          intro: "কুরআন মাজীদে বর্ণিত যাকাতের ৮টি খাতে অগ্রাধিকার ভিত্তিতে সঠিকভাবে বণ্টন।",
          items: [],
        },
        {
          title: "অন্যান্য জারিয়ামূলক প্রকল্প (সাদাকায়ে জারিয়াহ)",
          items: [
            "মসজিদ ভিত্তিক বয়স্কদের কুরআন ও দ্বীনি শিক্ষাদান",
            "মহিলাদের কুরআন ও দ্বীনি শিক্ষাদান",
            "দ্বীনি দারস, ইসলামী সেমিনার ইত্যাদির মাধ্যমে দ্বীন শিক্ষাদান",
            "বিভিন্ন মসজিদে বিশুদ্ধ আকিদা ও মানহাজ ভিত্তিক ইসলামী পাঠাগার স্থাপন ও ফ্রি ইসলামী বই, লিফলেট বিতরণ",
            "ইয়াতিম ও গরিব তালিবুল ইলমের পৃষ্ঠপোষকতা ও তত্ত্বাবধায়ক",
            "দরিদ্র ও মিসকিন সহযোগিতাকরণ",
            "দ্বীনি বই-পুস্তক, দোয়ার চার্ট প্রকাশনা",
            "ফ্রি চিকিৎসা/বৃক্ষ রোপণ/টিউবওয়েল স্থাপন",
            "মসজিদ ও মাদরাসা নির্মাণে সহযোগিতাকরণ",
          ],
        },
        {
          title: "পুনর্বাসন প্রকল্প",
          items: [
            "দুস্থ, দরিদ্র, অসহায়দের মাঝে প্রয়োজন অনুযায়ী ঘর নির্মাণ",
            "গৃহপালিত পশু বিতরণ",
            "কর্মসংস্থানের ব্যবস্থা",
            "প্রয়োজন অনুযায়ী এককালীন সহযোগিতাকরণ",
          ],
        },
      ],
      closingNote:
        "এছাড়াও সাদাকা/সাদাকায়ে জারিয়ার মধ্যে পড়ে এমন সকল প্রকল্প ভবিষ্যতে পরিচালিত হবে, ইনশাআল্লাহ।",
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
    },
    footer: {
      tagline: "As-Salsabil Foundation — ongoing charitable (sadaqah jariyah) work, established 2021.",
      rights: "All rights reserved.",
    },
  },
};

export const getDictionary = (language: Language): Dictionary => dictionaries[language];
