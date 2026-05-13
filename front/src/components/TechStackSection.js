import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const TechStackSection = ({ t }) => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t.techStack.title}
          </h2>
          <p className="text-lg text-gray-500">{t.techStack.subtitle}</p>
        </div>

        <Swiper
          key={t.dir}
          modules={[Autoplay]}
          loop={true}
          speed={4000}
          slidesPerView={"auto"}
          spaceBetween={80}
          dir={t.dir}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: t.dir === "rtl",
          }}
          allowTouchMove={true}
          className="tech-swiper !overflow-visible"
        >
          {[...t.techStack.technologies, ...t.techStack.technologies].map(
            (tech, index) => (
              <SwiperSlide
                key={index}
                style={{ width: "auto" }}
                className="!overflow-visible"
              >
                <div className="flex flex-col items-center justify-center transition-all duration-500 hover:scale-125 cursor-pointer group origin-center">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="h-14 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />

                  <span className="mt-4 text-xs font-bold tracking-widest uppercase text-slate-400 group-hover:text-slate-900 transition-colors duration-500 whitespace-nowrap">
                    {tech.name}
                  </span>
                </div>
              </SwiperSlide>
            ),
          )}
        </Swiper>
      </div>

      <div className="tools-section mt-32">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          style={{ width: "80%", margin: "auto" }}
        >
          {t.techStack.tools.map((tool, index) => (
            <div
              key={index}
              className="tool-card bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 text-center hover:shadow-lg transition-all hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <img
                src={tool.image}
                alt={tool.name}
                className="w-12 h-12 mx-auto mb-3 object-contain"
              />
              <div className="font-semibold text-sm text-gray-800">
                {tool.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
