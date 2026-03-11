import React from "react";
import { Clock } from "lucide-react";

const JourneySection = ({ t }) => {
  return (
    <section id="journey" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t.journey.title}
          </h2>
          <p className="text-lg text-gray-600">{t.journey.subtitle}</p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full timeline-line"></div>

          <div className="space-y-12">
            {t.journey.stages.map((stage, index) => (
              <div
                key={index}
                className={`flex items-center ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex-1"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {stage.number}
                  </div>
                </div>

                <div className="flex-1 px-8">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                    <p className="text-gray-600 mb-3">{stage.desc}</p>
                    <div className="flex items-center gap-2 text-sm text-deep-blue font-semibold">
                      <Clock className="w-4 h-4" />
                      {stage.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
