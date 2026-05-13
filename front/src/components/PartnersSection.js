import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const partnersData = [
  { name: "Google", url: "https://www.vectorlogo.zone/logos/google/google-icon.svg" },
  { name: "Microsoft", url: "https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg" },
  { name: "Amazon", url: "https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg" },
  { name: "Meta", url: "https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg" },
  { name: "Oracle", url: "https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg" },
  { name: "IBM", url: "https://www.vectorlogo.zone/logos/ibm/ibm-icon.svg" },
  { name: "Adobe", url: "https://www.vectorlogo.zone/logos/adobe/adobe-icon.svg" },
  { name: "SAP", url: "https://www.vectorlogo.zone/logos/sap/sap-icon.svg" }
];

const PartnersSection = ({ t }) => {
  return (
    <section id="partners" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            {t.partners.title}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t.partners.subtitle}
          </p>
        </div>

        <div className="partners-clean-wrapper py-10">
          <Swiper
      
            key={t.dir} 
            dir={t.dir}
            modules={[Autoplay]}
            loop={true}
            speed={5000} 
            slidesPerView={'auto'}
            spaceBetween={80} 
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
                          reverseDirection: t.dir === "rtl",
            }}
            allowTouchMove={true}
            className="partners-swiper !overflow-visible" 
          >
            {[...partnersData, ...partnersData].map((partner, index) => (
              <SwiperSlide key={index} style={{ width: 'auto' }} className="!overflow-visible">
                <div className="flex flex-col items-center justify-center transition-all duration-500 hover:scale-125 cursor-pointer group origin-center">
                  
                  <img 
                    src={partner.url} 
                    alt={partner.name} 
                    className="h-12 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                  />
                  
                  <span className="mt-4 text-[14px] font-bold tracking-[0.2em] uppercase text-slate-300 group-hover:text-slate-900 transition-colors duration-500 whitespace-nowrap">
                    {partner.name}
                  </span>
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;