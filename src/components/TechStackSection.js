import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const TechStackSection = ({ t, lang }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t.techStack.title}
          </h2>
          <p className="text-lg text-gray-600">{t.techStack.subtitle}</p>
        </div>

        {/* Technologies Carousel */}
        <div className="tech-section-wrapper mb-20">
          <Swiper
            key={lang}
            dir={t.dir}
            modules={[Autoplay]}
            slidesPerView={"auto"}
            spaceBetween={50}
            loop={true}
            freeMode={true}
            speed={3000}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            allowTouchMove={false}
            className="tech-swiper"
          >
            {t.techStack.technologies.map((tech, index) => (
              <SwiperSlide key={index} style={{ width: "auto" }}>
                <div className="tech-item-card group">
                  <div className="tech-geometric-box">
                    <div className="tech-box-face main-face">
                      <img
                        src={tech.image}
                        alt={tech.name}
                        className="tech-icon-svg"
                      />
                    </div>
                    <div className="tech-box-shadow"></div>
                  </div>
                  <span className="tech-text-label">{tech.name}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Tools Section */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
};

export default TechStackSection;
