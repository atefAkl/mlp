import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./index.css";
import "./styles/TechStack.css";

import content from "./data/content";
import { getVariant } from "./utils/analytics";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import TechStackSection from "./components/TechStackSection";
import RequirementsSection from "./components/RequirementsSection";
import JourneySection from "./components/JourneySection";
import SuccessSection from "./components/SuccessSection";
import PartnersSection from "./components/PartnersSection";
import ContactSection from "./components/ContactSection";
import CourseDetails from "./components/CourseDetails";


import Footer from "./components/Footer";

function App() {
  const [lang, setLang] = useState("ar");
  const [view, setView] = useState("landing"); // 'landing' | 'course'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const t = content[lang];

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen bg-white ${t.font}`} dir={t.dir}>
      <Navbar
        t={t}
        lang={lang}
        setLang={setLang}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
        onNavigate={() => setView("course")}
        isCourseView={view === "course"}
      />

      {view === "landing" ? (
        <>
          <HeroSection
            t={t}
            lang={lang}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            scrollToSection={scrollToSection}
          />
          <ProblemSection t={t} />
          <SolutionSection t={t} />
          <TechStackSection t={t} lang={lang} />
          <RequirementsSection t={t} />
          <JourneySection t={t} />
          <SuccessSection t={t} lang={lang} />
          <PartnersSection t={t} />
          <ContactSection t={t} lang={lang} onNavigate={() => setView("course")} />
        </>
      ) : (
        <CourseDetails t={t} lang={lang} onBack={() => setView("landing")} />
      )}

      <Footer t={t} scrollToSection={scrollToSection} />
    </div>
  );
}

export default App;
