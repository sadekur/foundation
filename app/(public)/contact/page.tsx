import type { Metadata } from "next";
import { ContactContent } from "./contact-content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with As-Salsabil Foundation — office address, phone/bKash/Nagad numbers, email, and social channels.",
};

export default function ContactPage() {
  return <ContactContent />;
}
