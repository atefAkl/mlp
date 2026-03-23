import React, { useRef, useEffect, useState, useCallback } from "react";
import { Target, Shield, Zap, ChevronDown } from "lucide-react";
import { trackEvent, getVariant } from "../utils/analytics";

// ── A/B variants ──────────────────────────────────────────────────────────────
const HEADLINE_VARIANTS = [
  { key: "A", text: "فجوة الخبرة تمنعك من الحصول على أول وظيفة عملية" },
  { key: "B", text: "لماذا لا تحصل على وظيفة رغم شهادتك" },
];

// ── Card metadata (order: methodology → fear → gap[highlighted]) ────────────
const cardMeta = [
  {
    key: "methodology",
    icon: <Zap className="w-8 h-8" />,
    accent: "from-orange-500 to-red-500",
    glow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.35)]",
    border: "border-slate-700 hover:border-orange-500",
    iconBg: "from-orange-500 to-red-500",
    highlight: false,
  },
  {
    key: "fear",
    icon: <Shield className="w-8 h-8" />,
    accent: "from-amber-500 to-orange-500",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]",
    border: "border-slate-700 hover:border-amber-400",
    iconBg: "from-amber-500 to-orange-500",
    highlight: false,
  },
  {
    key: "gap",
    icon: <Target className="w-8 h-8" />,
    accent: "from-red-500 to-rose-600",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_45px_rgba(239,68,68,0.5)]",
    border: "border-red-500/50 hover:border-red-400 ring-1 ring-red-500/20",
    iconBg: "from-red-500 to-rose-600",
    highlight: true,
  },
];

// ── ProblemHero ───────────────────────────────────────────────────────────────
const ProblemHero = ({ title, subtitle, badgeText }) => (
  <div className="text-center mb-14 px-2" data-aos="fade-up">
    <span className="inline-block bg-red-500/10 text-red-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-red-500/20">
      ⚠️ {badgeText}
    </span>
    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight max-w-2xl mx-auto">
      {title}
    </h2>
    <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
      {subtitle}
    </p>
  </div>
);

// ── ProblemCards ──────────────────────────────────────────────────────────────
const ProblemCards = ({ t, onCardView }) => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onCardView(cardMeta[i].key);
            obs.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [onCardView]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cardMeta.map((item, index) => (
        <div
          key={item.key}
          ref={(el) => (cardRefs.current[index] = el)}
          className={`group relative bg-slate-900 border ${item.border} ${item.glow} rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] cursor-default`}
          data-aos="fade-up"
          data-aos-delay={index * 150}
        >
          {/* highlighted badge */}
          {item.highlight && (
            <span className="absolute top-4 end-4 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
              الأكثر تأثيراً
            </span>
          )}

          {/* top accent bar */}
          <div
            className={`absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r ${item.accent} rounded-b-full ${item.highlight ? "opacity-100" : "opacity-60 group-hover:opacity-100"} transition-opacity duration-300`}
          />

          <div
            className={`w-14 h-14 bg-gradient-to-br ${item.iconBg} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg`}
          >
            {item.icon}
          </div>

          <h3 className="text-xl font-bold text-white mb-3">
            {t.problem[item.key]}
          </h3>
          <p className="text-slate-400 leading-relaxed text-sm">
            {t.problem[item.key + "Desc"]}
          </p>
        </div>
      ))}
    </div>
  );
};

// ── ProblemCTA ────────────────────────────────────────────────────────────────
const ProblemCTA = ({ ctaText, ctaTarget }) => {
  const handleClick = () => {
    trackEvent("problem_cta_click");
    const el = document.getElementById(ctaTarget);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="text-center mt-12" data-aos="fade-up">
      <button
        onClick={handleClick}
        aria-label={ctaText}
        className="inline-flex items-center gap-2 text-sm text-red-400 border border-red-500/30 hover:border-red-400 hover:bg-red-500/10 px-6 py-2.5 rounded-full transition-all duration-200"
      >
        {ctaText}
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

// ── ProblemSection ────────────────────────────────────────────────────────────
const ProblemSection = ({ t }) => {
  const sectionRef = useRef(null);

  // A/B: lazy-init once at mount, stable across renders
  const [headline] = useState(() =>
    getVariant("hero_headline_test", HEADLINE_VARIANTS)
  );

  // Fire problem_view once when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("problem_view", { variant: headline.key });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [headline.key]);

  const handleCardView = useCallback(
    (cardKey) => trackEvent("problem_card_view", { card: cardKey, variant: headline.key }),
    [headline.key]
  );

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <ProblemHero
          title={headline.text}
          subtitle={t.problem.heroSubtitle}
          badgeText={t.problem.subtitle}
        />
        <ProblemCards t={t} onCardView={handleCardView} />
        <ProblemCTA ctaText={t.problem.ctaText} ctaTarget="solution" />
      </div>
    </section>
  );
};

export default ProblemSection;
