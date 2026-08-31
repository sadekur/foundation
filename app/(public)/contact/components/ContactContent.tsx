"use client";

import { Mail, MapPin, Phone, Youtube, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/siteConfig";
import { SectionDivider } from "../../components/SectionDivider";
import { FadeIn } from "../../components/FadeIn";
import { ContactForm } from "./ContactForm";

export const ContactContent = () => {
  const { language } = useLanguage();
  const { contact } = getDictionary(language);

  const infoCards = [
    { icon: MapPin, label: contact.officeLabel, value: contact.office },
    { icon: Phone, label: contact.phoneLabel, value: siteConfig.phones.join(", "), note: contact.phoneNote },
  ];

  return (
    <div>
      <div className="bg-emerald-950 pattern-lattice-light">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14 text-center">
          <FadeIn>
            <h1 className="text-2xl xs:text-3xl font-bold text-white">{contact.title}</h1>
            <SectionDivider className="mt-4 mb-5" />
            <p className="text-sm xs:text-base text-emerald-100 leading-relaxed max-w-3xl mx-auto">
              {contact.intro}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 xs:gap-8">
          <FadeIn className="lg:col-span-3">
            <ContactForm form={contact.form} />
          </FadeIn>

          <FadeIn delayMs={120} className="lg:col-span-2">
            <div className="space-y-4">
              {infoCards.map(({ icon: Icon, label, value, note }) => (
                <div key={label} className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-emerald-950">{label}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {value} {note && <span className="text-gray-400">{note}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-400">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-emerald-950">{contact.emailLabel}</h2>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-sm text-emerald-700 hover:text-amber-600 hover:underline mt-1 block"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-400">
                <h2 className="text-sm font-semibold text-emerald-950 mb-3">{contact.socialTitle}</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Youtube size={18} className="text-red-600 flex-shrink-0" />
                    <span>{siteConfig.youtube.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Facebook size={18} className="text-blue-600 flex-shrink-0" />
                    <span>{siteConfig.facebook.label}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
                <h2 className="text-base font-semibold text-amber-900 mb-2">{contact.donationTitle}</h2>
                <p className="text-sm text-amber-800 leading-relaxed">{contact.donationBody}</p>
                <p className="text-sm font-medium text-amber-900 mt-2">
                  {siteConfig.phones.join(" / ")}{" "}
                  <span className="font-normal text-amber-700">{contact.phoneNote}</span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};
