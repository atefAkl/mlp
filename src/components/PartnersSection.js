import React from "react";

const partnersLogos = [
  {
    name: "Google",
    url: "https://www.vectorlogo.zone/logos/google/google-ar21.svg",
  },
  {
    name: "Microsoft",
    url: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg",
  },
  {
    name: "Amazon",
    url: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg",
  },
  {
    name: "Meta",
    url: "https://www.vectorlogo.zone/logos/facebook/facebook-ar21.svg",
  },
  {
    name: "Oracle",
    url: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg",
  },
  { name: "IBM", url: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg" },
  {
    name: "Adobe",
    url: "https://www.vectorlogo.zone/logos/adobe/adobe-ar21.svg",
  },
  { name: "SAP", url: "https://www.vectorlogo.zone/logos/sap/sap-ar21.svg" },
];

const PartnersSection = ({ t }) => {
  return (
    <section
      id="partners"
      className="py-24 px-4 bg-white border-y border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            {t.partners.title}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t.partners.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partnersLogos.map((partner, index) => (
            <div
              key={index}
              className="group relative flex items-center justify-center transition-all duration-300"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="absolute -inset-6 bg-slate-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={partner.url}
                alt={partner.name}
                className="relative h-10 md:h-12 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
