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
    toast.success(isRTL ? 'تم حفظ إعدادات النظام بنجاح' : 'System settings saved successfully');
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faGear} className="text-theme-primary" />
            {isRTL ? 'إعدادات النظام العامة' : 'General System Settings'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRTL ? 'تخصيص الإعدادات العامة لاسم المنصة، التواصل، وإعدادات التسجيل والصيانة.' : 'Configure default system branding, emails, user registrations, and maintenance.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Settings Pane */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
              {isRTL ? 'معلومات الهوية والتواصل' : 'Identity & Contact Info'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* App Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isRTL ? 'اسم التطبيق / المنصة' : 'Application Name'}
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
                  {isRTL ? 'البريد الإلكتروني للتواصل' : 'Support Contact Email'}
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
                {isRTL ? 'اللغة الافتراضية للنظام' : 'Default System Language'}
              </label>
              <select
                name="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={handleChange}
                className="w-full md:w-1/2 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition bg-white"
              >
                <option value="ar">{isRTL ? 'العربية (AR)' : 'Arabic (AR)'}</option>
                <option value="en">{isRTL ? 'الإنجليزية (EN)' : 'English (EN)'}</option>
              </select>
            </div>
          </div>

          {/* System Control Settings */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
              {isRTL ? 'التحكم في التسجيل والصلاحيات' : 'System & Registration Controls'}
            </h2>

            <div className="space-y-4">
              {/* Allow Registration Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <h3 className="text-xs font-black text-slate-800">
                    {isRTL ? 'السماح بتسجيل الحسابات الجديدة' : 'Allow New User Registrations'}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {isRTL ? 'تمكين أو تعطيل إمكانية تسجيل مشتركين جدد في المنصة.' : 'Enable or disable signups for new accounts on the registration page.'}
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
                    {isRTL ? 'تفعيل وضع الصيانة المؤقت' : 'Enable Maintenance Mode'}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {isRTL ? 'سيتم منع غير المسؤولين من تصفح المنصة وإظهار صفحة صيانة مؤقتة.' : 'Restricts portal access to administrators only and shows a temporary offline message.'}
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

        {/* Right Info Sidebar / Save Action */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {isRTL ? 'إجراءات الحفظ' : 'Save Changes'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRTL ? 'سيتم تطبيق كافة التعديلات في النظام فور النقر على زر الحفظ.' : 'All system modifications take effect immediately upon clicking save.'}
            </p>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-xs font-black uppercase tracking-wider"
              icon={faSave}
            >
              {isRTL ? 'حفظ التعديلات' : 'Save Settings'}
            </Button>
          </div>

          {/* Alert/Caution Card */}
          {settings.maintenanceMode && (
            <div className="bg-red-50 rounded-3xl border border-red-200/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>{isRTL ? 'وضع الصيانة نشط حالياً' : 'Maintenance Mode Active'}</span>
              </div>
              <p className="text-[10px] text-red-600/90 leading-relaxed">
                {isRTL 
                  ? 'يرجى الحذر! وضع الصيانة سيمنع جميع المشتركين والمستخدمين العاديين من استخدام التطبيق حتى تقوم بإيقاف تشغيله مجدداً.' 
                  : 'Warning: Users and trainees will not be able to log in or use the platform until maintenance mode is turned off.'}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
