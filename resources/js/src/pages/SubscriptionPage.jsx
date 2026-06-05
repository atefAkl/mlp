import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import SubscriptionSection from "../components/SubscriptionSection";
import Footer from "../components/Footer";

const SubscriptionPage = () => {
    const { t: translate, i18n } = useTranslation();
    const t = translate("landing", { returnObjects: true });
    const lang = i18n.language || "ar";
    const setLang = (newLang) => i18n.changeLanguage(newLang);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    useEffect(() => {
        document.documentElement.dir = t.dir;
        document.documentElement.lang = lang;
    }, [lang, t.dir]);

    const registrationRequest = useMemo(() => {
        const audience = location.state?.audience;
        if (!audience) return null;

        return {
            audience,
            token: location.state?.token || Date.now(),
        };
    }, [location.state]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            return;
        }

        navigate("/", { state: { scrollTo: id } });
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
                onNavigate={() => navigate("/")}
                onRegister={() =>
                    navigate("/subscribe", {
                        replace: true,
                        state: { audience: "trainee", token: Date.now() },
                    })
                }
                showTopActions={false}
            />

            <main className="pt-16">
                <SubscriptionSection
                    lang={lang}
                    registrationRequest={registrationRequest}
                />
            </main>

            <Footer t={t} scrollToSection={scrollToSection} />
        </div>
    );
};

export default SubscriptionPage;
