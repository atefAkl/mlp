import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faSave, faTriangleExclamation, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import { getGeneralSettings, saveGeneralSettings } from '../utils/themeHelper';
import { toast } from 'react-toastify';

const GeneralSettings = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [settings, setSettings] = useState({
    appName: 'MAWTHIQ',
    contactEmail: 'info@mawthiq.loc',
    defaultLanguage: 'ar',
    maintenanceMode: false,
    allowRegistration: true
  });

  useEffect(() => {
    setSettings(getGeneralSettings());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (name) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveGeneralSettings(settings);
    toast.success(t('auto.system_settings_saved_successfully'));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6" dir={t('auto.ltr')}>
      {/* Header / Title Box */}
      <div className="bg-white border border-slate-200 p-4 flex items-start justify-between mb-2">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faGear} className="text-theme-primary" />
            {t('auto.general_system_settings')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('auto.configure_default_system_branding_emails')}
          </p>
        </div>
        <Button
          type="submit"
          variant="primary"
          className="px-4 py-2 text-xs font-black uppercase tracking-wider"
          icon={faSave}
          tooltip={t('auto.save_settings')}
        >
          {t('auto.save')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Settings Pane */}
        <div className={settings.maintenanceMode ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
              {t('auto.identity_contact_info')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* App Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t('auto.application_name')}
                </label>
                <input
                  type="text"
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition"
                  required
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t('auto.support_contact_email')}
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {t('auto.default_system_language')}
              </label>
              <select
                name="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={handleChange}
                className="w-full md:w-1/2 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition bg-white"
              >
                <option value="ar">{t('auto.arabic_ar')}</option>
                <option value="en">{t('auto.english_en')}</option>
              </select>
            </div>
          </div>

          {/* System Control Settings */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
              {t('auto.system_registration_controls')}
            </h2>

            <div className="space-y-4">
              {/* Allow Registration Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <h3 className="text-xs font-black text-slate-800">
                    {t('auto.allow_new_user_registrations')}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {t('auto.enable_or_disable_signups_for_new_accoun')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('allowRegistration')}
                  className="text-2xl text-slate-400 hover:text-theme-primary focus:outline-none smooth-transition"
                >
                  <FontAwesomeIcon 
                    icon={settings.allowRegistration ? faToggleOn : faToggleOff} 
                    className={settings.allowRegistration ? "text-theme-primary" : "text-slate-300"} 
                  />
                </button>
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <h3 className="text-xs font-black text-slate-800">
                    {t('auto.enable_maintenance_mode')}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {t('auto.restricts_portal_access_to_administrator')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('maintenanceMode')}
                  className="text-2xl text-slate-400 hover:text-theme-primary focus:outline-none smooth-transition"
                >
                  <FontAwesomeIcon 
                    icon={settings.maintenanceMode ? faToggleOn : faToggleOff} 
                    className={settings.maintenanceMode ? "text-red-500" : "text-slate-300"} 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Sidebar (Alert/Caution Card) */}
        {settings.maintenanceMode && (
          <div className="space-y-6">
            <div className="bg-red-50 rounded-3xl border border-red-200/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>{t('auto.maintenance_mode_active')}</span>
              </div>
              <p className="text-[10px] text-red-600/90 leading-relaxed">
                {t('auto.warning_users_and_trainees_will_not_be_a')}
              </p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default GeneralSettings;
