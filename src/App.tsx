import { MotionConfig } from "framer-motion";
import FloatingActions from "./components/layout/FloatingActions";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import AdminPanel from "./components/admin/AdminPanel";
import PrivacyPage from "./components/pages/PrivacyPage";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import Feedback from "./components/sections/Feedback";
import Gallery from "./components/sections/Gallery";
import GoogleReviews from "./components/sections/GoogleReviews";
import Hero from "./components/sections/Hero";
import Hospitality from "./components/sections/Hospitality";
import Services from "./components/sections/Services";
import WhyChooseUs from "./components/sections/WhyChooseUs";

/** Minimal client-side routing: the home page plus /privacy and /admin. */
function currentPath(): string {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export default function App() {
  const path = currentPath();

  if (path === "/admin") return <AdminPanel />;
  if (path === "/privacy") return <PrivacyPage />;

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only z-[60] bg-champagne px-4 py-2 text-charcoal focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="overflow-hidden">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Hospitality />
        <WhyChooseUs />
        <GoogleReviews />
        <Feedback />
        <Contact />
      </main>

      <Footer />
      <FloatingActions />
    </MotionConfig>
  );
}
