import React from "react";
import { Wrench, Briefcase, GitBranch, Users2 } from "lucide-react";

const iconMap = {
  tool: Wrench,
  portfolio: Briefcase,
  deploy: GitBranch,
  team: Users2,
};

const SolutionSection = ({ t }) => {
  return (
    <section id="solution" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.solution.title}
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {t.solution.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.solution.features.map((feature, index) => {
                const Icon = iconMap[feature.icon] || Wrench;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                    <p className="text-sm opacity-75 leading-relaxed">
                      {feature.benefit}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div data-aos="fade-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "8", label: t.solution.stats?.weeks || "أسابيع تدريب" },
                  { value: "5", label: t.solution.stats?.stages || "مراحل تطور" },
                  { value: "100%", label: t.solution.stats?.practical || "تطبيق عملي" },
                  { value: "24/7", label: t.solution.stats?.support || "دعم فني" },
                ].map(({ value, label }, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-bold mb-2">{value}</div>
                    <div className="text-sm opacity-80">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
