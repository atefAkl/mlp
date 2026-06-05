import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProblemSection from "../components/ProblemSection";
import SolutionSection from "../components/SolutionSection";
import TechStackSection from "../components/TechStackSection";
import RequirementsSection from "../components/RequirementsSection";
import JourneySection from "../components/JourneySection";
import SuccessSection from "../components/SuccessSection";
import PartnersSection from "../components/PartnersSection";
import ContactSection from "../components/ContactSection";
import CourseDetails from "../components/CourseDetails";
import Footer from "../components/Footer";

const LandingPage = () => {
    const [view, setView] = useState("landing"); // 'landing' | 'course'
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const { t: translate, i18n } = useTranslation();
    const t = translate("landing", { returnObjects: true });
    const lang = i18n.language || "ar";
    const setLang = (newLang) => i18n.changeLanguage(newLang);

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

    useEffect(() => {
        const target = location.state?.scrollTo;
        if (view !== "landing" || !target) return;

        const animationFrame = window.requestAnimationFrame(() => {
            const element = document.getElementById(target);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
            navigate(location.pathname, { replace: true, state: null });
        });

        return () => window.cancelAnimationFrame(animationFrame);
    }, [location.pathname, location.state, navigate, view]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
    };

    const openCourseView = () => {
        setView("course");
    };

    const openRegistrationForm = (audience = "trainee") => {
        navigate("/subscribe", { state: { audience, token: Date.now() } });
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
                onNavigate={openCourseView}
                onRegister={() => openRegistrationForm("trainee")}
                isCourseView={view === "course"}
                showTopActions={false}
            />

            {view === "landing" ? (
                <>
                    <HeroSection
                        t={t}
                        lang={lang}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                        scrollToSection={scrollToSection}
                        onRegister={() => openRegistrationForm("trainee")}
                    />
                    <ProblemSection t={t} />
                    <SolutionSection t={t} />
                    <TechStackSection t={t} lang={lang} />
                    <RequirementsSection t={t} />
                    <JourneySection t={t} />
                    <SuccessSection t={t} lang={lang} />
                    <PartnersSection t={t} />
                    <ContactSection
                        t={t}
                        lang={lang}
                        onNavigate={openCourseView}
                    />
                </>
            ) : (
                <CourseDetails
                    t={t}
                    lang={lang}
                    onBack={() => setView("landing")}
                    onEnroll={openRegistrationForm}
                />
            )}

            <Footer t={t} scrollToSection={scrollToSection} />
        </div>
    );
};

export default LandingPage;
