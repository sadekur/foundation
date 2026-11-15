import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AnalyticsTracker } from "./components/AnalyticsTracker";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AnalyticsTracker />
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
