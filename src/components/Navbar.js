import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Globe, Menu, X } from "lucide-react";

const Navbar = ({
  t,
  lang,
  setLang,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection,
}) => {
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold gradient-text">Mawthiq</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {Object.entries(t.nav).map(([key, value]) => (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className="text-gray-600 hover:text-deep-blue transition-colors font-medium"
              >
                {value}
              </button>
            ))}

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">
                {lang === "ar" ? "English" : "العربية"}
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t"
            >
              <div className="flex flex-col gap-4">
                {Object.entries(t.nav).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      scrollToSection(key);
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-deep-blue transition-colors font-medium text-right"
                  >
                    {value}
                  </button>
                ))}

                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all justify-end"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">
                    {lang === "ar" ? "English" : "العربية"}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
