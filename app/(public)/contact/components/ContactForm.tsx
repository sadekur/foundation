"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import type { ContactFormDictionary } from "@/lib/i18n/dictionaries";

type Status = "idle" | "sending" | "success" | "error";

const initialFormState = { name: "", email: "", phone: "", message: "" };

export const ContactForm = ({ form }: { form: ContactFormDictionary }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (field: keyof typeof initialFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("request failed");

      setStatus("success");
      setFormData(initialFormState);
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full p-3 border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors";

  return (
    <div className="bg-emerald-950 rounded-2xl p-6 xs:p-8 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 pattern-lattice-light pointer-events-none" aria-hidden="true" />
      <div className="relative">
        <h2 className="text-xl xs:text-2xl font-bold text-white mb-2">{form.title}</h2>
        <p className="text-sm text-emerald-200 mb-6">{form.intro}</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-stone-50 rounded-xl p-5 xs:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{form.nameLabel}</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={form.namePlaceholder}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{form.emailLabel}</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={form.emailPlaceholder}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">{form.phoneLabel}</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder={form.phonePlaceholder}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">{form.messageLabel}</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={form.messagePlaceholder}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 text-emerald-950 font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {form.submitting}
              </>
            ) : (
              <>
                <Send size={16} />
                {form.submit}
              </>
            )}
          </button>

          {status === "success" && (
            <p className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 size={16} className="flex-shrink-0" />
              {form.successMessage}
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} className="flex-shrink-0" />
              {form.errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
