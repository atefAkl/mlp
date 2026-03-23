import React, { useRef, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const TestimonialCard = ({ story }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = story.quote.length > 160;

  return (
    <div
      className="relative flex flex-col h-full
                  bg-white/10 backdrop-blur-xl
                  border border-white/20 rounded-3xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                  transition-all duration-500 hover:bg-white/[0.16] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
                  hover:-translate-y-1 p-6 gap-4"
    >
      {/* Quote Icon */}
      <FaQuoteLeft className="text-white/20 text-3xl shrink-0" />

      {/* Quote Text */}
      <div className="flex-grow">
        <p
          className={`text-white/90 leading-relaxed text-sm md:text-base font-medium transition-all duration-300 ${
            !expanded && isLong ? "line-clamp-4" : ""
          }`}
        >
          {story.quote}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-emerald-300 text-xs font-bold hover:text-emerald-200 transition-colors focus:outline-none"
            aria-expanded={expanded}
          >
            {expanded ? "▲ أقل" : "▼ أكثر"}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Author */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Avatar */}
        <div className="relative w-12 h-12 shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 to-white/20 opacity-40 animate-spin-slow" />
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/40 shadow-lg">
            {story.image ? (
              <img
                src={story.image}
                alt={story.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/20 text-white text-lg font-bold">
                {story.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Name + Role + Stars */}
        <div className="min-w-0">
          <h4 className="text-white font-black text-sm leading-tight truncate">
            {story.name}
          </h4>
          <p className="text-emerald-300 text-[11px] font-semibold leading-tight mt-0.5 line-clamp-2">
            {story.position}
          </p>
          <div className="flex gap-0.5 mt-1" aria-label="5 stars">
            {[...Array(5)].map((_, i) => (
              <AiFillStar
                key={i}
                className="text-yellow-400 text-xs drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
              />
            ))}
          </div>
        </div>

        {/* Country + Date */}
        <div className="ms-auto text-end shrink-0">
          <span className="block text-white/70 text-[10px] font-bold uppercase tracking-widest">
            {story.country}
          </span>
          <span className="block text-white/40 text-[10px] font-medium tracking-wider mt-0.5">
            {story.date}
          </span>
        </div>
      </div>
    </div>
  );
};

const SuccessSection = ({ t, lang }) => {
  const swiperRef = useRef(null);

  return (
    <section
      id="success"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white overflow-hidden"
      aria-label={t.success.title}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h2
          className="text-3xl md:text-4xl font-extrabold mb-3 text-white drop-shadow-sm"
          data-aos="fade-up"
        >
          {t.success.title}
        </h2>
        <p
          className="text-base text-white/60 max-w-2xl mx-auto leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {t.success.subtitle}
        </p>
      </div>

      {/* Carousel */}
      <div
        className="max-w-7xl mx-auto"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <Swiper
          key={lang}
          dir={t.dir}
          modules={[Autoplay, Navigation]}
          slidesPerView={1}
          spaceBetween={24}
          loop={true}
          speed={600}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: ".swiper-btn-next",
            prevEl: ".swiper-btn-prev",
          }}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="!pb-4"
        >
          {t.success.stories.map((story, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <TestimonialCard story={story} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            className="swiper-btn-prev w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center
                       hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Previous slide"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={t.dir === "rtl" ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {t.success.stories.map((_, i) => (
              <button
                key={i}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                className="w-2 h-2 rounded-full bg-white/30 hover:bg-emerald-400 transition-all duration-300 focus:outline-none"
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="swiper-btn-next w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center
                       hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Next slide"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={t.dir === "rtl" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessSection;