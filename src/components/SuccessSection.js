import React from "react";
import { AiFillStar } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const SuccessSection = ({ t, lang }) => {
  return (
    <section
      id="success"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
          data-aos="fade-up"
        >
          {t.success.title}
        </h2>
        <p
          className="text-lg text-white/70"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {t.success.subtitle}
        </p>
      </div>

      <div className="success-marquee-container">
        <Swiper
          key={lang}
          dir={t.dir}
          modules={[Autoplay]}
          slidesPerView={"auto"}
          spaceBetween={40}
          loop={true}
          speed={8000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={true}
          className="success-swiper-continuous"
        >
          {[...t.success.stories, ...t.success.stories].map((story, index) => (
            <SwiperSlide key={index} style={{ width: "400px" }}>
              <div className="success-card-marquee-white group">
                <div className="stars-container">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar
                      key={i}
                      className="text-yellow-400 text-lg shadow-sm"
                    />
                  ))}
                </div>

                <div className="flex flex-col h-full justify-between relative z-10">
                  <p className="quote-text">"{story.quote}"</p>

                  <div className="flex items-center gap-4 pt-6 mt-4 border-t border-gray-100">
                    <div className="avatar-minimal">{story.name.charAt(0)}</div>
                    <div>
                      <h4 className="user-name">{story.name}</h4>
                      <div className="flex flex-col">
                        <span className="user-position">{story.position}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SuccessSection;
