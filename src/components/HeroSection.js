import React, { useEffect } from "react";
import { ChevronRight } from "lucide-react";

const HeroSection = ({
  t,
  lang,
  currentSlide,
  setCurrentSlide,
  scrollToSection,
}) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % t.hero.carousel.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [t.hero.carousel.length, setCurrentSlide]);

  return (
    <section className="min-h-[500px] h-[67vh] w-full overflow-hidden relative">
      <div
        className={`min-h-[500px] h-[67vh] w-full flex items-center text-white relative overflow-hidden hero-gradient-${currentSlide}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {t.hero.badge}
            </div>

            <div
              className="flex items-center gap-4 mb-6 opacity-0 animate-fade-in"
              key={`title-${currentSlide}`}
            >
              <div className="w-16 h-16 p-3 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-700 ease-out">
                {t.hero.carousel[currentSlide].icon}
              </div>
              <h1 className="text-4xl md:text-3xl lg:text-4xl font-bold leading-tight transition-all duration-700 ease-out">
                {t.hero.carousel[currentSlide].title}
                <span className="animate-pulse">|</span>
              </h1>
            </div>

            <p
              className="text-lg md:text-xl mb-8 leading-relaxed opacity-90 max-w-2xl transition-all duration-700 ease-out opacity-0 animate-fade-in-delay"
              key={`subtitle-${currentSlide}`}
            >
              {t.hero.carousel[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection("cta")}
                className="btn-primary bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-2xl"
              >
                {t.hero.carousel[currentSlide].cta}
                <ChevronRight
                  className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`}
                />
              </button>

              <div className="flex items-center gap-4 px-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-semibold opacity-90">
                  {t.hero.stats}
                </span>
              </div>
            </div>
          </div>

          <div data-aos="fade-left" className="relative lg:block hidden">
            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs text-white/80 font-mono">
                    Mawthiq IDE
                  </div>
                </div>

                <div
                  style={{ fontFamily: "monospace" }}
                  dir="ltr"
                  className="bg-black/50 rounded-lg p-4 font-mono text-sm"
                >
                  <div className="text-green-400 mb-2">
                    {"// Welcome to Mawthiq"}
                  </div>
                  <div className="text-blue-400 mb-2">
                    class CareerBridge {"{"}
                  </div>
                  <div className="text-gray-400 ml-4 mb-2">
                    constructor() {"{"}
                  </div>
                  <div className="text-emerald-400 ml-8 mb-2">
                    this.status = 'Expert';
                  </div>
                  <div className="text-emerald-400 ml-8 mb-2">
                    this.confidence = 100;
                  </div>
                  <div className="text-gray-400 ml-4 mb-2">{"}"}</div>
                  <div className="text-blue-400">{"}"}</div>

                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-emerald/30 text-emerald text-xs rounded">
                      ✓ Sprint Active
                    </span>
                    <span className="px-2 py-1 bg-blue-500/30 text-blue-300 text-xs rounded">
                      PR Approved
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 -right-10 w-20 h-20 bg-white/20 rounded-full animate-float"></div>
            <div
              className="absolute bottom-10 -left-10 w-16 h-16 bg-white/20 rounded-full animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {t.hero.carousel.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
