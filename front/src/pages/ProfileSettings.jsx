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
  faSignature 
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
  setActiveCustomBrand
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
  const [saveToList, setSaveToList] = useState(false);

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
    if (!customName.trim()) {
      toast.error(isRTL ? 'يرجى إدخال اسم للون المخصص' : 'Please enter a name for the custom color');
      return;
    }

    let shouldSave = saveToList;

    if (!shouldSave) {
      const confirmSave = window.confirm(
        isRTL 
          ? 'هل تحب إضافة هذا اللون المخصص للقائمة الموجودة وحفظه بشكل دائم؟' 
          : 'Would you like to add this custom color to the existing list and save it permanently?'
      );
      if (confirmSave) {
        shouldSave = true;
      }
    }

    if (shouldSave) {
      const uniqueKey = `custom-${Date.now()}`;
      saveCustomBrandToList(uniqueKey, customName, customName, customHex);
      
      const nextState = {
        ...themeState,
        brand: uniqueKey
      };
      setThemeState(nextState);
      applyThemeSettings(uniqueKey, nextState.background, nextState.font);
      toast.success(isRTL ? 'تم حفظ اللون وإضافته للقائمة بنجاح!' : 'Custom color saved and added to the list successfully!');
      setSaveToList(false); // Reset checkbox
    } else {
      setActiveCustomBrand(customHex, customName, customName);
      
      const nextState = {
        ...themeState,
        brand: 'custom'
      };
      setThemeState(nextState);
      applyThemeSettings('custom', nextState.background, nextState.font);
      toast.success(isRTL ? 'تم تطبيق اللون المخصص بنجاح!' : 'Custom color applied successfully!');
    }
  };

  const isCustomBrandActive = themeState.brand === 'custom' || themeState.brand.startsWith('custom-');
  const previewBrand = isCustomBrandActive
    ? generateBrandColors(customHex, customName || (isRTL ? 'لون مخصص' : 'Custom Color'), customName || 'Custom Color')
    : (BRANDS[themeState.brand] || BRANDS['royal-blue']);

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-theme-primary" />
          {isRTL ? 'الملف الشخصي والإعدادات الخاصة' : 'Profile & Personal Settings'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isRTL ? 'إدارة تفاصيل حسابك الشخصي وكلمة المرور وتخصيص تجربة التصفح والمظهر الخاص بك.' : 'Manage your personal account details, passwords, and personalize your theme and fonts.'}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'account'
              ? 'border-theme-primary text-theme-primary font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FontAwesomeIcon icon={faSignature} />
          {isRTL ? 'معلومات الحساب' : 'Account Info'}
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'appearance'
              ? 'border-theme-primary text-theme-primary font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FontAwesomeIcon icon={faPalette} />
          {isRTL ? 'تخصيص المظهر' : 'Appearance'}
        </button>
      </div>

      {/* Tab 1: Account Info */}
      {activeTab === 'account' && (
        <form onSubmit={handleSaveAccount} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
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
          </div>

          {/* Action sidebar */}
          <div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                {isRTL ? 'حفظ الحساب' : 'Account Actions'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRTL ? 'يرجى مراجعة المدخلات جيداً والتأكد من تطابق كلمة المرور الجديدة.' : 'Ensure passwords match and email is valid before saving your updates.'}
              </p>
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-xs font-black uppercase tracking-wider"
                icon={faSave}
              >
                {isRTL ? 'حفظ البيانات' : 'Save Details'}
              </Button>
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
                  return (
                    <button
                      key={key}
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
                    {/* Name Input - above the color picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {isRTL ? 'اسم اللون المخصص' : 'Color Name'}
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary smooth-transition"
                        placeholder={isRTL ? 'مثال: أزرق فيروزي، برتقالي دافئ' : 'e.g., Turquoise, Warm Amber'}
                        required
                      />
                    </div>

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
                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange('background', key)}
                      className={`group flex flex-col p-2.5 rounded-2xl border-2 transition-all text-start relative hover:-translate-y-0.5 ${
                        isActive 
                          ? 'border-slate-900 shadow-sm font-black' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {/* Color Preview Tile */}
                      <span 
                        className="w-full h-12 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center"
                        style={{ backgroundColor: bg.bg }}
                      >
                        {isActive && (
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-600 mt-2 text-center w-full font-bold">
                        {isRTL ? bg.name : bg.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                  backgroundColor: BACKGROUNDS[themeState.background]?.bg,
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
                  {BACKGROUNDS[themeState.background]?.nameEn}
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
