import React from "react";
import { 
  Mail, Phone, MapPin, 
  Facebook, Twitter, Linkedin, Instagram, Send 
} from "lucide-react";
import logo1 from"../assets/logo1.png"

const Footer = ({ t, scrollToSection }) => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          
          <div className="md:col-span-1">
                      
                        <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logo1}
                alt="Mawthiq Logo" 
                className="w-16 h-12 object-contain" 
              />
              <span className="text-xl font-bold">Mawthiq</span>
            </div>
        </div>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              {t.footer.about}
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald hover:text-white transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-b border-emerald w-fit pb-1">
              {t.footer.quickLinks}
            </h3>
            <div className="flex flex-col gap-3">
              {Object.entries(t.nav).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="text-gray-400 hover:text-emerald transition-colors text-start w-full text-sm"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-b border-emerald w-fit pb-1">
              {t.footer.contact}
            </h3>
            <div className="space-y-4 text-gray-400 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald shrink-0" />
                <span className="break-all">info@mawthiq.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald shrink-0" />
                <span dir="ltr">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald shrink-0" />
                <span>{t.footer.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-b border-emerald w-fit pb-1">
              {t.footer.newsletterTitle}
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              {t.footer.newsletterSubtitle}
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t.footer.emailPlaceholder}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-emerald transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-deep-blue to-emerald p-2 rounded-lg hover:scale-105 transition-all">
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs tracking-wider">
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;