import React from "react";
import { CheckCircle2 } from "lucide-react";

const SolutionSection = ({ t }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.solution.title}
            </h2>
            <p className="text-lg mb-8 opacity-90">{t.solution.subtitle}</p>

            <div className="space-y-4">
              {t.solution.points.map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-aos="fade-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">8</div>
                  <div className="text-sm opacity-80">أسابيع تدريب</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">5</div>
                  <div className="text-sm opacity-80">مراحل تطور</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-sm opacity-80">تطبيق عملي</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-80">دعم فني</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
