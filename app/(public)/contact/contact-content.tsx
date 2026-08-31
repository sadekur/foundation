"use client";

import { Mail, MapPin, Phone, Youtube, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/siteConfig";

export const ContactContent = () => {
  const { language } = useLanguage();
  const { contact } = getDictionary(language);

  return (
    <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10 xs:py-14">
      <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-3">{contact.title}</h1>
      <p className="text-sm xs:text-base text-gray-700 leading-relaxed max-w-3xl mb-8">{contact.intro}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5 xs:p-6">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{contact.officeLabel}</h2>
              <p className="text-sm text-gray-600 mt-1">{contact.office}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 xs:p-6">
          <div className="flex items-start gap-3">
            <Phone size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{contact.phoneLabel}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {siteConfig.phones.join(", ")} <span className="text-gray-400">{contact.phoneNote}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 xs:p-6">
          <div className="flex items-start gap-3">
            <Mail size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{contact.emailLabel}</h2>
              <a href={`mailto:${siteConfig.email}`} className="text-sm text-indigo-700 hover:underline mt-1 block">
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 xs:p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">{contact.socialTitle}</h2>
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
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5 xs:p-6">
        <h2 className="text-base xs:text-lg font-semibold text-green-900 mb-2">{contact.donationTitle}</h2>
        <p className="text-sm text-green-800 leading-relaxed">{contact.donationBody}</p>
        <p className="text-sm font-medium text-green-900 mt-2">
          {siteConfig.phones.join(" / ")} <span className="font-normal text-green-700">{contact.phoneNote}</span>
        </p>
      </div>
    </div>
  );
};
