export const BRANDS = {
  'royal-blue': {
    name: 'أزرق ملكي',
    nameEn: 'Royal Blue',
    primary: '#2563eb',
    hover: '#1d4ed8',
    light: '#eff6ff',
    shadow: 'rgba(37, 99, 235, 0.1)',
    border: 'rgba(37, 99, 235, 0.15)',
  },
  'golden-amber': {
    name: 'كهرمان ذهبي',
    nameEn: 'Golden Amber',
    primary: '#d97706',
    hover: '#b45309',
    light: '#fffbeb',
    shadow: 'rgba(217, 119, 6, 0.1)',
    border: 'rgba(217, 119, 6, 0.15)',
  },
  'deep-teal': {
    name: 'تركواز عميق',
    nameEn: 'Deep Teal',
    primary: '#0d9488',
    hover: '#0f766e',
    light: '#f0fdfa',
    shadow: 'rgba(13, 148, 136, 0.1)',
    border: 'rgba(13, 148, 136, 0.15)',
  },
  'terracotta': {
    name: 'ترابي قرميدي',
    nameEn: 'Terracotta',
    primary: '#ea580c',
    hover: '#c2410c',
    light: '#fff7ed',
    shadow: 'rgba(234, 88, 12, 0.1)',
    border: 'rgba(234, 88, 12, 0.15)',
  },
  'olive-bronze': {
    name: 'زيتوني برونزي',
    nameEn: 'Olive Bronze',
    primary: '#854d0e',
    hover: '#713f12',
    light: '#fefce8',
    shadow: 'rgba(133, 77, 14, 0.1)',
    border: 'rgba(133, 77, 14, 0.15)',
  }
};

export const BACKGROUNDS = {
  'classic-beige': { name: 'بيج كلاسيكي', nameEn: 'Classic Beige', bg: '#f6f4eb' },
  'desert-sand': { name: 'رمل الصحراء', nameEn: 'Desert Sand', bg: '#fdf8f5' },
  'nordic-sage': { name: 'مرمر نورديك', nameEn: 'Nordic Sage', bg: '#f4f6f0' },
  'terracotta-light': { name: 'طين فاتح', nameEn: 'Terracotta Light', bg: '#faf6f0' },
  'vintage-parchment': { name: 'ورق عتيق', nameEn: 'Vintage Parchment', bg: '#faf8f5' },
  'cool-gray': { name: 'رمادي بارد', nameEn: 'Cool Gray', bg: '#f1f5f9' },
  'pure-white': { name: 'أبيض ناصع', nameEn: 'Pure White', bg: '#ffffff' }
};

export const FONTS = {
  'cairo': { name: 'خط القاهرة', nameEn: 'Cairo', family: "'Cairo', sans-serif" },
  'almarai': { name: 'خط المراعي', nameEn: 'Almarai', family: "'Almarai', sans-serif" },
  'tajawal': { name: 'خط تجول', nameEn: 'Tajawal', family: "'Tajawal', sans-serif" },
  'ibm-plex': { name: 'خط آي بي إم', nameEn: 'IBM Plex Sans Arabic', family: "'IBM Plex Sans Arabic', sans-serif" },
  'inter': { name: 'خط إنتر', nameEn: 'Inter', family: "'Inter', sans-serif" }
};

export const getThemeSettings = () => {
  const brand = localStorage.getItem('theme-brand') || 'royal-blue';
  const background = localStorage.getItem('theme-background') || 'cool-gray';
  const font = localStorage.getItem('theme-font') || 'cairo';
  return { brand, background, font };
};

export const applyThemeSettings = (brandKey, bgKey, fontKey) => {
  const brand = BRANDS[brandKey] || BRANDS['royal-blue'];
  const bg = BACKGROUNDS[bgKey] || BACKGROUNDS['cool-gray'];
  const font = FONTS[fontKey] || FONTS['cairo'];

  const root = document.documentElement;
  
  // Apply brand colors
  root.style.setProperty('--theme-primary', brand.primary);
  root.style.setProperty('--theme-primary-hover', brand.hover);
  root.style.setProperty('--theme-primary-light', brand.light);
  root.style.setProperty('--theme-shadow', brand.shadow);
  root.style.setProperty('--theme-border-accent', brand.border);
  
  // Apply page background color
  root.style.setProperty('--theme-bg-page', bg.bg);
  
  // Apply font family
  root.style.setProperty('--theme-font', font.family);

  // Save to localStorage
  localStorage.setItem('theme-brand', brandKey);
  localStorage.setItem('theme-background', bgKey);
  localStorage.setItem('theme-font', fontKey);

  // Trigger event for components that listen
  window.dispatchEvent(new CustomEvent('theme-settings-updated', {
    detail: { brandKey, bgKey, fontKey }
  }));
};

export const getGeneralSettings = () => {
  const appName = localStorage.getItem('app-name') || 'MAWTHIQ';
  const contactEmail = localStorage.getItem('contact-email') || 'info@mawthiq.loc';
  const defaultLanguage = localStorage.getItem('default-language') || 'ar';
  const maintenanceMode = localStorage.getItem('maintenance-mode') === 'true';
  const allowRegistration = localStorage.getItem('allow-registration') === 'true';
  return { appName, contactEmail, defaultLanguage, maintenanceMode, allowRegistration };
};

export const saveGeneralSettings = (settings) => {
  localStorage.setItem('app-name', settings.appName);
  localStorage.setItem('contact-email', settings.contactEmail);
  localStorage.setItem('default-language', settings.defaultLanguage);
  localStorage.setItem('maintenance-mode', settings.maintenanceMode ? 'true' : 'false');
  localStorage.setItem('allow-registration', settings.allowRegistration ? 'true' : 'false');

  // Trigger event for sidebar updates
  window.dispatchEvent(new CustomEvent('app-settings-updated', {
    detail: settings
  }));
};
