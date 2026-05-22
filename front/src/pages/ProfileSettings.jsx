import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPalette, 
  faCheck, 
  faLock, 
  faSave, 
  faEye, 
  faSignature,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import { 
  BRANDS, 
  BACKGROUNDS, 
  FONTS, 
  getThemeSettings, 
  applyThemeSettings,
  generateBrandColors,
  saveCustomBrandToList,
  saveCustomBackgroundToList,
  setActiveCustomBrand,
  setActiveCustomBackground,
  deleteCustomBrand,
  deleteCustomBackground
} from '../utils/themeHelper';
import { setCredentials } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  
  const { user, token } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('account'); // 'account' or 'appearance'
  
  // Account Form State
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Theme Settings State
  const [themeState, setThemeState] = useState({
    brand: 'royal-blue',
    background: 'cool-gray',
    font: 'cairo'
  });

  // Custom Color State
  const [customName, setCustomName] = useState('');
  const [customHex, setCustomHex] = useState('#4f46e5');
  const [customBgHex, setCustomBgHex] = useState('#f5f5f5');
  const [saveToList, setSaveToList] = useState(false);
  const [colorVersion, setColorVersion] = useState(0); // triggers re-render on add/delete

  useEffect(() => {
    if (user) {
      setAccountForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
    const settings = getThemeSettings();
    setThemeState(settings);
    if (settings.brand) {
      const activeBrandObj = BRANDS[settings.brand] || BRANDS['custom'];
      if (activeBrandObj) {
        setCustomName(isRTL ? (activeBrandObj.name || '') : (activeBrandObj.nameEn || ''));
        setCustomHex(activeBrandObj.primary || '#4f46e5');
      }
    }
  }, [user, isRTL]);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    
    // Validate passwords if user tried to change them
    if (accountForm.newPassword) {
      if (accountForm.newPassword !== accountForm.confirmPassword) {
        toast.error(isRTL ? 'كلمات المرور الجديدة غير متطابقة' : 'New passwords do not match');
        return;
      }
      if (!accountForm.currentPassword) {
        toast.error(isRTL ? 'يرجى إدخال كلمة المرور الحالية لتأكيد التغيير' : 'Please enter current password to confirm change');
        return;
      }
    }

    // Save user info locally
    const updatedUser = {
      ...user,
      name: accountForm.name,
      email: accountForm.email
    };
    
    dispatch(setCredentials({ user: updatedUser, token }));
    toast.success(isRTL ? 'تم حفظ بيانات الحساب بنجاح' : 'Account details saved successfully');
    
    // Clear password fields
    setAccountForm(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleThemeChange = (type, key) => {
    const nextState = {
      ...themeState,
      [type]: key
    };
    setThemeState(nextState);
    applyThemeSettings(nextState.brand, nextState.background, nextState.font);

    // If it's a custom color, update custom input fields
    if (type === 'brand' && (key === 'custom' || key.startsWith('custom-'))) {
      const brandObj = BRANDS[key];
      if (brandObj) {
        setCustomName(isRTL ? brandObj.name : brandObj.nameEn);
        setCustomHex(brandObj.primary);
      }
    }

    toast.info(isRTL ? 'تم تطبيق المظهر المختار' : 'Selected theme applied');
  };

  const handleApplyCustomColor = () => {
    const promptedName = window.prompt(
      isRTL ? 'أدخل اسماً للون المخصص:' : 'Enter a name for this custom color:',
      customName || (isRTL ? 'لون مخصص' : 'Custom Color')
    );
    if (promptedName === null) return; // User cancelled
    const colorName = promptedName.trim() || (isRTL ? 'لون مخصص' : 'Custom Color');
    setCustomName(colorName);

    let shouldSave = saveToList;
    if (!shouldSave) {
      shouldSave = window.confirm(
        isRTL 
          ? 'هل تحب إضافة هذا اللون للقائمة وحفظه بشكل دائم؟' 
          : 'Would you like to add this color to the existing list and save it permanently?'
      );
    }

    if (shouldSave) {
      const uniqueKey = `custom-${Date.now()}`;
      saveCustomBrandToList(uniqueKey, colorName, colorName, customHex);
      const nextState = { ...themeState, brand: uniqueKey };
      setThemeState(nextState);
      applyThemeSettings(uniqueKey, nextState.background, nextState.font);
      toast.success(isRTL ? 'تم حفظ اللون وإضافته للقائمة بنجاح!' : 'Custom color saved and added to the list successfully!');
      setSaveToList(false);
      setColorVersion(v => v + 1);
    } else {
      setActiveCustomBrand(customHex, colorName, colorName);
      const nextState = { ...themeState, brand: 'custom' };
      setThemeState(nextState);
      applyThemeSettings('custom', nextState.background, nextState.font);
      toast.success(isRTL ? 'تم تطبيق اللون المخصص بنجاح!' : 'Custom color applied successfully!');
    }
  };

  const handleApplyCustomBg = () => {
    const promptedName = window.prompt(
      isRTL ? 'أدخل اسماً لهذه الخلفية المخصصة:' : 'Enter a name for this custom background:',
      isRTL ? 'خلفية مخصصة' : 'Custom Background'
    );
    if (promptedName === null) return;
    const bgName = promptedName.trim() || (isRTL ? 'خلفية مخصصة' : 'Custom Background');

    const shouldSave = window.confirm(
      isRTL
        ? 'هل تحب إضافة هذه الخلفية للقائمة وحفظها بشكل دائم؟'
        : 'Would you like to add this background to the existing list and save it permanently?'
    );

    if (shouldSave) {
      const uniqueKey = `custom-bg-${Date.now()}`;
      saveCustomBackgroundToList(uniqueKey, bgName, bgName, customBgHex);
      const nextState = { ...themeState, background: uniqueKey };
      setThemeState(nextState);
      applyThemeSettings(nextState.brand, uniqueKey, nextState.font);
      toast.success(isRTL ? 'تم حفظ الخلفية وإضافتها للقائمة بنجاح!' : 'Background saved and added to the list successfully!');
      setColorVersion(v => v + 1);
    } else {
      setActiveCustomBackground(customBgHex, bgName, bgName);
      const nextState = { ...themeState, background: 'custom-bg' };
      setThemeState(nextState);
      applyThemeSettings(nextState.brand, 'custom-bg', nextState.font);
      toast.success(isRTL ? 'تم تطبيق الخلفية المخصصة بنجاح!' : 'Custom background applied successfully!');
    }
  };

  const handleDeleteCustomBrand = (key) => {
    if (!window.confirm(isRTL ? 'هل تريد حذف هذا اللون؟' : 'Are you sure you want to delete this color?')) return;
    deleteCustomBrand(key);
    if (themeState.brand === key) {
      const nextState = { ...themeState, brand: 'royal-blue' };
      setThemeState(nextState);
      applyThemeSettings('royal-blue', nextState.background, nextState.font);
    }
    setColorVersion(v => v + 1);
    toast.success(isRTL ? 'تم حذف اللون بنجاح' : 'Color deleted successfully');
  };

  const handleDeleteCustomBg = (key) => {
    if (!window.confirm(isRTL ? 'هل تريد حذف هذه الخلفية؟' : 'Are you sure you want to delete this background?')) return;
    deleteCustomBackground(key);
    if (themeState.background === key) {
      const nextState = { ...themeState, background: 'cool-gray' };
      setThemeState(nextState);
      applyThemeSettings(nextState.brand, 'cool-gray', nextState.font);
    }
    setColorVersion(v => v + 1);
    toast.success(isRTL ? 'تم حذف الخلفية بنجاح' : 'Background deleted successfully');
  };

  const isCustomBrandActive = themeState.brand === 'custom' || themeState.brand.startsWith('custom-');
  const previewBrand = isCustomBrandActive
    ? generateBrandColors(customHex, customName || (isRTL ? 'لون مخصص' : 'Custom Color'), customName || 'Custom Color')
    : (BRANDS[themeState.brand] || BRANDS['royal-blue']);
  const previewBgColor = (themeState.background === 'custom-bg' || themeState.background.startsWith('custom-bg-'))
    ? customBgHex
    : (BACKGROUNDS[themeState.background]?.bg || '#f1f5f9');

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 flex items-start justify-between mb-2">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-theme-primary" />
            {isRTL ? 'الملف الشخصي والإعدادات الخاصة' : 'Profile & Personal Settings'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRTL ? 'إدارة تفاصيل حسابك الشخصي وكلمة المرور وتخصيص تجربة التصفح والمظهر الخاص بك.' : 'Manage your personal account details, passwords, and personalize your theme and fonts.'}
          </p>
        </div>
        {activeTab === 'account' && (
          <Button
            variant="primary"
            onClick={handleSaveAccount}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider"
            tooltip={isRTL ? 'حفظ' : 'Save'}
          >
            {isRTL ? 'حفظ' : 'Save'}
          </Button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white border border-slate-200 flex items-stretch px-4 gap-2 mb-2 relative">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-3.5 text-xs font-bold transition-all flex items-center gap-2 -mb-[1px] border-b-2 ${
            activeTab === 'account'
              ? 'border-theme-primary text-theme-primary font-black'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FontAwesomeIcon icon={faSignature} className={activeTab === 'account' ? 'text-theme-primary' : 'text-slate-400'} />
          {isRTL ? 'معلومات الحساب' : 'Account Info'}
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-3.5 text-xs font-bold transition-all flex items-center gap-2 -mb-[1px] border-b-2 ${
            activeTab === 'appearance'
              ? 'border-theme-primary text-theme-primary font-black'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FontAwesomeIcon icon={faPalette} className={activeTab === 'appearance' ? 'text-theme-primary' : 'text-slate-400'} />
          {isRTL ? 'تخصيص المظهر' : 'Appearance'}
        </button>
      </div>

      {/* Tab 1: Account Info */}
      {activeTab === 'account' && (
        <form onSubmit={handleSaveAccount} className="space-y-6 animate-fade-in">
            {/* Basic Details */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                {isRTL ? 'البيانات الأساسية' : 'Basic Details'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {isRTL ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={accountForm.name}
                    onChange={handleAccountChange}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={accountForm.email}
                    onChange={handleAccountChange}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faLock} className="text-slate-400" />
                  {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isRTL ? 'اترك الحقول فارغة في حال لم تكن ترغب في تعديل كلمة المرور.' : 'Leave these fields blank if you do not want to update your password.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={accountForm.currentPassword}
                    onChange={handleAccountChange}
                    className="w-full md:w-1/2 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition"
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={accountForm.newPassword}
                      onChange={handleAccountChange}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={accountForm.confirmPassword}
                      onChange={handleAccountChange}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
      )}

      {/* Tab 2: Appearance Customize */}
      {activeTab === 'appearance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Main Visual Settings Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand Accent Colors */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                {isRTL ? 'ألوان هوية النظام (Brand Accent Color)' : 'Brand Accent Colors'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRTL ? 'حدد اللون التفاعلي الرئيسي الذي سيتم تطبيقه على الأزرار، والروابط النشطة، وعناصر الواجهة الرئيسية.' : 'Choose the primary focus color for buttons, active items, toggles, and highlights.'}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                {Object.entries(BRANDS).map(([key, brand]) => {
                  const isActive = themeState.brand === key;
                  const isDeletable = key.startsWith('custom-');
                  return (
                    <div key={`brand-${key}-${colorVersion}`} className="relative group">
                      <button
                        onClick={() => handleThemeChange('brand', key)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all hover:scale-[1.02] shadow-xs ${
                          isActive 
                            ? 'border-slate-900 bg-slate-50 font-black' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <span 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs border shadow-inner"
                          style={{ backgroundColor: brand.primary }}
                        >
                          {isActive && <FontAwesomeIcon icon={faCheck} />}
                        </span>
                        <span className="text-xs text-slate-700">
                          {isRTL ? brand.name : brand.nameEn}
                        </span>
                      </button>
                      {isDeletable && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteCustomBrand(key); }}
                          className="absolute -top-2 -end-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 hover:scale-110"
                          title={isRTL ? 'حذف اللون' : 'Delete color'}
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-[7px]" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Custom Color Settings Panel */}
              {(themeState.brand === 'custom' || themeState.brand.startsWith('custom-')) && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-theme-primary animate-pulse" />
                    {isRTL ? 'إعدادات اللون المخصص' : 'Custom Color Configuration'}
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {/* Color Picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {isRTL ? 'قيمة اللون' : 'Color Value'}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customHex}
                          onChange={(e) => setCustomHex(e.target.value)}
                          className="w-12 h-10 border border-slate-200 rounded-xl cursor-pointer p-1 shadow-sm smooth-transition hover:scale-105"
                        />
                        <input
                          type="text"
                          value={customHex}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.startsWith('#')) {
                              if (val.length <= 7) setCustomHex(val);
                            } else {
                              if (val.length <= 6) setCustomHex('#' + val);
                            }
                          }}
                          placeholder="#ffffff"
                          className="w-28 px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    {/* Ask to save checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="save-to-list"
                        checked={saveToList}
                        onChange={(e) => setSaveToList(e.target.checked)}
                        className="rounded border-slate-300 text-theme-primary focus:ring-theme-primary/30 h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="save-to-list" className="text-xs text-slate-600 font-bold select-none cursor-pointer">
                        {isRTL 
                          ? 'هل تحب إضافته للقائمة الموجودة؟' 
                          : 'Would you like to add it to the existing list?'}
                      </label>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={handleApplyCustomColor}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-end sm:self-auto"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      {isRTL ? 'تطبيق وحفظ اللون' : 'Apply & Save Color'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Page Background Colors */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                {isRTL ? 'خلفية صفحات الموقع (Page Background)' : 'Page Background Colors'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRTL ? 'حدد لون الخلفية للمنصة بالكامل لخلق تباين مثالي مع الكروت البيضاء المرتفعة.' : 'Select a theme background color to contrast beautifully with white content panels.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {Object.entries(BACKGROUNDS).map(([key, bg]) => {
                  const isActive = themeState.background === key;
                  const isDeletable = key.startsWith('custom-bg-');
                  const isCustomPlaceholder = key === 'custom-bg';
                  const tileColor = isCustomPlaceholder ? customBgHex : bg.bg;
                  return (
                    <div key={`bg-${key}-${colorVersion}`} className="relative group">
                      <button
                        onClick={() => handleThemeChange('background', key)}
                        className={`flex flex-col p-2.5 rounded-2xl border-2 transition-all text-start hover:-translate-y-0.5 w-full ${
                          isActive 
                            ? 'border-slate-900 shadow-sm font-black' 
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {/* Color Preview Tile */}
                        <span 
                          className="w-full h-12 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center"
                          style={{ backgroundColor: tileColor }}
                        >
                          {isActive && (
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                              <FontAwesomeIcon icon={faCheck} />
                            </span>
                          )}
                          {isCustomPlaceholder && !isActive && (
                            <span className="text-slate-400 text-base font-light leading-none">+</span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-600 mt-2 text-center w-full font-bold">
                          {isRTL ? bg.name : bg.nameEn}
                        </span>
                      </button>
                      {isDeletable && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteCustomBg(key); }}
                          className="absolute -top-2 -end-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 hover:scale-110"
                          title={isRTL ? 'حذف الخلفية' : 'Delete background'}
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-[7px]" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Custom Background Panel */}
              {(themeState.background === 'custom-bg' || themeState.background.startsWith('custom-bg-')) && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-theme-primary animate-pulse" />
                    {isRTL ? 'إعدادات الخلفية المخصصة' : 'Custom Background Configuration'}
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {isRTL ? 'قيمة لون الخلفية' : 'Background Color Value'}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customBgHex}
                        onChange={(e) => {
                          setCustomBgHex(e.target.value);
                          BACKGROUNDS['custom-bg'] = { ...BACKGROUNDS['custom-bg'], bg: e.target.value };
                          document.documentElement.style.setProperty('--theme-bg-page', e.target.value);
                        }}
                        className="w-12 h-10 border border-slate-200 rounded-xl cursor-pointer p-1 shadow-sm smooth-transition hover:scale-105"
                      />
                      <input
                        type="text"
                        value={customBgHex}
                        onChange={(e) => {
                          const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
                          if (val.length <= 7) {
                            setCustomBgHex(val);
                            if (val.length === 7) {
                              BACKGROUNDS['custom-bg'] = { ...BACKGROUNDS['custom-bg'], bg: val };
                              document.documentElement.style.setProperty('--theme-bg-page', val);
                            }
                          }
                        }}
                        placeholder="#f5f5f5"
                        className="w-28 px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary uppercase"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleApplyCustomBg}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      {isRTL ? 'تطبيق وحفظ الخلفية' : 'Apply & Save Background'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Typography Fonts Selection */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                {isRTL ? 'خطوط النصوص والكتابة (Typography Font)' : 'Typography Font Family'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRTL ? 'اختر خط الويب المفضل لعرض القوائم، التقارير والواجهة بالكامل.' : 'Select your preferred font family for headers, tables, lists, and content texts.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {Object.entries(FONTS).map(([key, font]) => {
                  const isActive = themeState.font === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange('font', key)}
                      className={`flex flex-col p-4 rounded-2xl border-2 transition-all text-start relative hover:-translate-y-0.5 ${
                        isActive 
                          ? 'border-slate-900 bg-slate-50 shadow-sm font-black' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-black text-slate-800">
                          {isRTL ? font.name : font.nameEn}
                        </span>
                        {isActive && (
                          <span className="text-theme-primary text-xs">
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 truncate w-full" style={{ fontFamily: font.family }}>
                        {font.family}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 sticky top-24">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <FontAwesomeIcon icon={faEye} className="text-slate-400" />
                {isRTL ? 'معاينة تجريبية فورية' : 'Live Appearance Preview'}
              </h2>
              <p className="text-[10px] text-slate-500">
                {isRTL 
                  ? 'هذا الكارت يوضح كيفية عرض المكونات، العناوين والنصوص بمجرد اختيار المظهر الجديد.' 
                  : 'This block demonstrates how components, colors, and typography interact live.'}
              </p>

              {/* Mini Preview Box */}
              <div 
                className="p-5 rounded-2xl border border-slate-200 transition-all space-y-4 shadow-inner"
                style={{ 
                  backgroundColor: previewBgColor,
                  fontFamily: FONTS[themeState.font]?.family
                }}
              >
                {/* Brand Header */}
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: previewBrand?.primary }}
                  />
                  <h4 className="text-xs font-black text-slate-800 uppercase">
                    {isRTL ? 'عنوان تجريبي رئيسي' : 'Sample Component'}
                  </h4>
                </div>

                {/* Body paragraph */}
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isRTL 
                    ? 'الخطوط والألوان تظهر بشكل ديناميكي هنا لضمان تناسق القراءة والجمالية العامة للمنصة.' 
                    : 'Typography and accents adjust dynamically here to ensure maximum layout harmony.'}
                </p>

                {/* Accented elements */}
                <div className="pt-2 flex gap-2">
                  <span 
                    className="px-2.5 py-1 text-[9px] font-black rounded-lg text-white"
                    style={{ backgroundColor: previewBrand?.primary }}
                  >
                    {isRTL ? 'زر نشط' : 'Accent Button'}
                  </span>
                  <span 
                    className="px-2.5 py-1 text-[9px] font-bold rounded-lg border"
                    style={{ 
                      color: previewBrand?.primary,
                      borderColor: previewBrand?.border,
                      backgroundColor: previewBrand?.light 
                    }}
                  >
                    {isRTL ? 'رابط خفيف' : 'Light Tag'}
                  </span>
                </div>
              </div>

              {/* Status Info */}
              <div className="text-[10px] text-slate-400 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-bold">{isRTL ? 'البراند النشط: ' : 'Active Brand: '}</span>
                  {isRTL ? previewBrand?.name : previewBrand?.nameEn}
                </div>
                <div>
                  <span className="font-bold">{isRTL ? 'الخلفية النشطة: ' : 'Active Background: '}</span>
                  {BACKGROUNDS[themeState.background]?.nameEn || (isRTL ? 'خلفية مخصصة' : 'Custom Background')}
                </div>
                <div>
                  <span className="font-bold">{isRTL ? 'الخط النشط: ' : 'Active Font: '}</span>
                  {FONTS[themeState.font]?.nameEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
