import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
