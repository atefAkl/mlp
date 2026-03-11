import React from "react";
import { AiFillStar } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const SuccessSection = ({ t, lang }) => {
  return (
    <section id="success" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white drop-shadow-sm" data-aos="fade-up">
          {t.success.title}
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {t.success.subtitle}
        </p>
      </div>

      <div className="success-marquee-container !overflow-visible">
        <Swiper
          key={lang}
          dir={t.dir}
          modules={[Autoplay]}
          slidesPerView={'auto'}
          spaceBetween={40}
          loop={true}
          speed={15000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          allowTouchMove={true}
          className="success-swiper-continuous !overflow-visible"
        >
          {[...t.success.stories, ...t.success.stories].map((story, index) => (
            <SwiperSlide key={index} style={{ width: '400px' }} className="py-12">
             
              <div className="relative group flex flex-col items-center text-center p-10 
                              bg-white/10 backdrop-blur-xl 
                              border border-white/20 rounded-[2.5rem]
                              shadow-[0_20px_50px_rgba(0,0,0,0.1)]
                              transition-all duration-700 hover:scale-105 hover:bg-white/[0.15] 
                              h-[500px] w-full">
             
                <div className="relative w-24 h-24 mb-6 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 to-white/20 animate-spin-slow opacity-30"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/40 shadow-2xl">
                    {story.image ? (
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/20 text-white text-3xl font-bold">
                        {story.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

           
                <h4 className="text-2xl font-black text-white mb-2 tracking-tight drop-shadow-md">
                  {story.name}
                </h4>


                <div className="mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 font-black uppercase tracking-[0.2em] border border-emerald-500/30">
                    {story.position}
                  </span>
                </div>

               
                <div className="flex flex-col gap-1 mb-8">
                  <span className="text-sm text-white/80 font-bold uppercase tracking-widest">{story.country}</span>
                  <span className="text-[10px] text-white/40 font-medium uppercase tracking-[0.3em]">{story.date}</span>
                </div>

               
                <div className="relative flex-grow flex items-center px-4">
                  <span className="absolute -top-6 left-0 text-7xl text-white/5 font-serif select-none italic">“</span>
                  <p className="text-white italic leading-[1.8] text-lg font-medium drop-shadow-sm line-clamp-4">
                    {story.quote}
                  </p>
                  <span className="absolute -bottom-10 right-0 text-7xl text-white/5 font-serif select-none italic">”</span>
                </div>

              
                <div className="mt-auto pt-6 flex gap-1.5 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar
                      key={i}
                      className="text-yellow-400 text-xl drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]"
                    />
                  ))}
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