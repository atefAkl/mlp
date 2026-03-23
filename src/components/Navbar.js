import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Globe, Menu, X, ChevronDown,
  Home, Map, Cpu, CheckSquare,
  Star, Users, Rocket, BookOpen,
  Building2, Briefcase, FolderOpen,
  Zap, MessageCircle,
} from "lucide-react";
import { trackEvent } from "../utils/analytics";

// Map icon-name strings → Lucide components + brand color classes
const ICON_MAP = {
  // column 1 — Sitemap (deep-blue accent)
  home:          { Ic: Home,        bg: "bg-blue-50",    fg: "text-blue-700"    },
  map:           { Ic: Map,         bg: "bg-blue-50",    fg: "text-blue-700"    },
  cpu:           { Ic: Cpu,         bg: "bg-blue-50",    fg: "text-blue-700"    },
  check:         { Ic: CheckSquare, bg: "bg-blue-50",    fg: "text-blue-700"    },
  // column 2 — Resources (emerald accent)
  star:          { Ic: Star,        bg: "bg-emerald-50", fg: "text-emerald-700" },
  handshake:     { Ic: Users,       bg: "bg-emerald-50", fg: "text-emerald-700" },
  rocket:        { Ic: Rocket,      bg: "bg-emerald-50", fg: "text-emerald-700" },
  book:          { Ic: BookOpen,    bg: "bg-emerald-50", fg: "text-emerald-700" },
  // column 3 — Business (teal accent)
  building:      { Ic: Building2,   bg: "bg-teal-50",    fg: "text-teal-700"    },
  briefcase:     { Ic: Briefcase,   bg: "bg-teal-50",    fg: "text-teal-700"    },
  folder:        { Ic: FolderOpen,  bg: "bg-teal-50",    fg: "text-teal-700"    },
  // column 4 — CTA (amber / gradient)
  zap:           { Ic: Zap,         bg: "bg-amber-50",   fg: "text-amber-600"   },
  chat:          { Ic: MessageCircle,bg:"bg-amber-50",   fg: "text-amber-600"   },
};

// ─── MegaMenu Panel ──────────────────────────────────────────────────────────
const MegaMenu = ({ t, scrollToSection, onClose }) => {
  const panels = t.megaMenu || [];

  return (
    <motion.div
      id="mega-menu"
      role="dialog"
      aria-label="Mega Menu"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      /* Brand dark-blue gradient background */
      className="absolute top-full left-0 right-0 z-50 shadow-2xl"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0d4f4f 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))` }}
        >
          {panels.map((col) => (
            <div key={col.title}>
              {/* Column Header */}
              <h3
                className={`text-md font-bold uppercase tracking-widest mb-4 pb-2 border-b ${
                  col.isCta
                    ? "text-amber-400 border-amber-400/30"
                    : "text-white border-white/50"
                }`}
                data-key={`megamenu_col_${col.title.toLowerCase().replace(/\s+/g, "_")}`}
              >
                {col.title}
              </h3>

              {/* Links */}
              <ul className="space-y-1" role="list">
                {col.links.map((link) => {
                  const meta = ICON_MAP[link.icon] || {};
                  const Icon = meta.Ic;

                  return (
                    <li key={link.label}>
                      <button
                        onClick={() => {
                          if (link.to && link.to !== "#") scrollToSection(link.to);
                          onClose();
                        }}
                        data-key={link.label.toLowerCase().replace(/\s+/g, "_")}
                        className={`flex items-center gap-3 w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400
                          ${
                            link.highlight
                              ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                              : "text-white/75 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {/* Icon badge */}
                        {Icon && (
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                              ${link.highlight
                                ? "bg-white/20"
                                : `${meta.bg || "bg-white/10"}`}`}
                            aria-hidden="true"
                          >
                            <Icon
                              className={`w-3.5 h-3.5 ${
                                link.highlight ? "text-white" : meta.fg || "text-white/70"
                              }`}
                              strokeWidth={1.8}
                            />
                          </span>
                        )}
                        {link.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle bottom divider line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
    </motion.div>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = ({ t, lang, setLang, mobileMenuOpen, setMobileMenuOpen, scrollToSection, onNavigate, isCourseView }) => {
  const [megaOpen, setMegaOpen] = useState(false);
  const navRef = useRef(null);

  // Close mega on outside click or Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setMegaOpen(false);
      if (navRef.current && !navRef.current.contains(e.target)) setMegaOpen(false);
    };
    document.addEventListener("keydown", handler);
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const toggleMega = () => {
    const next = !megaOpen;
    setMegaOpen(next);
    if (next) trackEvent("mega_menu_open", { lang });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full bg-white/90 backdrop-blur-lg shadow-sm z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo ── */}
          <button
            onClick={() => isCourseView ? (window.location.href = "/") : scrollToSection("hero")}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg group"
            aria-label={t.footer?.brandName || "Mawthiq"}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold gradient-text" data-key="brand_name">
              {t.footer?.brandName || "Mawthiq"}
            </span>
          </button>

          {/* ── Desktop Controls ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* MegaMenu Trigger */}
            {!isCourseView ? (
              <button
                onClick={toggleMega}
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400
                  ${megaOpen
                    ? "bg-gray-100 text-deep-blue"
                    : "text-gray-600 hover:bg-gray-50 hover:text-deep-blue"}`}
              >
                {t.nav?.home ? (lang === "ar" ? "القائمة" : "Menu") : "Menu"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <button
                onClick={() => window.location.href = "/"}
                className="text-sm font-semibold text-gray-600 hover:text-deep-blue transition-colors px-4 py-2"
              >
                {t.nav?.home || "Home"}
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label={lang === "ar" ? "Switch to English" : "التحويل للعربية"}
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "ar" ? "EN" : "ع"}</span>
            </button>

            {/* CTA Button */}
            <button
              onClick={() => isCourseView ? null : onNavigate()}
              className={`px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400
                ${isCourseView 
                  ? "bg-emerald-500 text-white cursor-default" 
                  : "bg-gradient-to-r from-deep-blue to-emerald text-white"}`}
              data-key="nav_cta"
            >
              {isCourseView ? (lang === "ar" ? "سجّل مكانك" : "Enroll Now") : (lang === "ar" ? "سجّل الآن" : "Get Started")}
            </button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col gap-5">
                {(t.megaMenu || []).map((col) => (
                  <div key={col.title}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
                      {col.title}
                    </p>
                    <div className="flex flex-col gap-1">
                      {col.links.map((link) => (
                        <button
                          key={link.label}
                          onClick={() => {
                            if (link.to && link.to !== "#") scrollToSection(link.to);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-start transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400
                            ${link.highlight
                              ? "bg-gradient-to-r from-deep-blue to-emerald text-white font-bold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-deep-blue"}`}
                        >
                          <span aria-hidden="true">{link.icon}</span>
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Lang toggle */}
                <button
                  onClick={() => {
                    setLang(lang === "ar" ? "en" : "ar");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-fit"
                >
                  <Globe className="w-4 h-4" />
                  <span>{lang === "ar" ? "English" : "العربية"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Desktop MegaMenu Panel ── */}
      <AnimatePresence>
        {megaOpen && (
          <MegaMenu
            t={t}
            scrollToSection={scrollToSection}
            onClose={() => setMegaOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
