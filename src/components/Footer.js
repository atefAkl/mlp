import React from "react";
import { Terminal, Mail, Phone, MapPin } from "lucide-react";

const Footer = ({ t, scrollToSection }) => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-lg flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Mawthiq</span>
            </div>
            <p className="text-gray-400 leading-relaxed">{t.footer.about}</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">{t.footer.quickLinks}</h3>
            <div className="space-y-2">
              {Object.entries(t.nav)
                .slice(0, 5)
                .map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(key)}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {value}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">{t.footer.contact}</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@mawthiq.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +966 50 123 4567
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Riyadh, Saudi Arabia
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
