import React from "react";
import { Target, Shield, Zap } from "lucide-react";

const ProblemSection = ({ t }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t.problem.title}
          </h2>
          <p className="text-lg text-gray-600">{t.problem.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { key: "gap", icon: <Target className="w-8 h-8" /> },
            { key: "fear", icon: <Shield className="w-8 h-8" /> },
            { key: "methodology", icon: <Zap className="w-8 h-8" /> },
          ].map((item, index) => (
            <div
              key={item.key}
              className="card-hover bg-gray-50 p-8 rounded-2xl border border-gray-100"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{t.problem[item.key]}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.problem[item.key + "Desc"]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
