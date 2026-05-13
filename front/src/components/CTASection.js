import React from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { trackEvent } from "../utils/analytics";

const CTASection = ({ t, lang, isFormSubmitted, setIsFormSubmitted, abCtaText }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email") || "";

    trackEvent("signup_submit", { source: "cta_form" });

    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
    } catch (_) {
      // silently fail — UI still proceeds to success state
    }

    setIsFormSubmitted(true);
  };

  return (
    <section
      id="cta"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-lg opacity-90">{t.cta.subtitle}</p>
        </div>

        <div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          data-aos="fade-up"
        >
          {!isFormSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.cta.form.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
                    placeholder={t.cta.form.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.cta.form.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
                    placeholder={t.cta.form.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.cta.form.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
                    placeholder={t.cta.form.phone}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.cta.form.track}
                  </label>
                  <select className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white">
                    <option value="">اختر المسار</option>
                    <option value="fullstack">Full Stack Development</option>
                    <option value="frontend">Frontend Development</option>
                    <option value="backend">Backend Development</option>
                    <option value="mobile">Mobile Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t.cta.form.message}
                </label>
                <textarea
                  rows="4"
                  className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
                  placeholder={t.cta.form.message}
                ></textarea>
              </div>

              <button
                type="submit"
                onClick={() =>
                  trackEvent("cta_click", {
                    ctaText: abCtaText || t.cta.primaryBtn || t.cta.form.submit,
                    variant: "cta_form",
                  })
                }
                aria-label={abCtaText || t.cta.primaryBtn || t.cta.form.submit}
                className="btn-primary w-full bg-white text-deep-blue py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                {abCtaText || t.cta.primaryBtn || t.cta.form.submit}
                <ChevronRight
                  className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`}
                />
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald/20 text-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.cta.success}</h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
