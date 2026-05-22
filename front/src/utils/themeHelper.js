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
  },
  'custom': {
    name: 'لون مخصص',
    nameEn: 'Custom Color',
    primary: '#4f46e5',
    hover: '#4338ca',
    light: 'rgba(79, 70, 229, 0.05)',
    shadow: 'rgba(79, 70, 229, 0.1)',
    border: 'rgba(79, 70, 229, 0.15)',
  }
};

export const BACKGROUNDS = {
  'classic-beige': { name: 'بيج كلاسيكي', nameEn: 'Classic Beige', bg: '#f6f4eb' },
  'desert-sand': { name: 'رمل الصحراء', nameEn: 'Desert Sand', bg: '#fdf8f5' },
  'nordic-sage': { name: 'مرمر نورديك', nameEn: 'Nordic Sage', bg: '#f4f6f0' },
  'terracotta-light': { name: 'طين فاتح', nameEn: 'Terracotta Light', bg: '#faf6f0' },
  'vintage-parchment': { name: 'ورق عتيق', nameEn: 'Vintage Parchment', bg: '#faf8f5' },
  'cool-gray': { name: 'رمادي بارد', nameEn: 'Cool Gray', bg: '#f1f5f9' },
  'pure-white': { name: 'أبيض ناصع', nameEn: 'Pure White', bg: '#ffffff' },
  'custom-bg': { name: 'خلفية مخصصة', nameEn: 'Custom Background', bg: '#f5f5f5' }
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

// --- Custom Brand Colors Logic ---

export const generateBrandColors = (hexColor, name = 'مخصص', nameEn = 'Custom') => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  // Darken for hover (multiply rgb by 0.8)
  const hr = Math.max(0, Math.floor(r * 0.8));
  const hg = Math.max(0, Math.floor(g * 0.8));
  const hb = Math.max(0, Math.floor(b * 0.8));
  const toHex = (c) => c.toString(16).padStart(2, '0');
  const hoverHex = `#${toHex(hr)}${toHex(hg)}${toHex(hb)}`;

  return {
    name,
    nameEn,
    primary: hexColor,
    hover: hoverHex,
    light: `rgba(${r}, ${g}, ${b}, 0.05)`,
    shadow: `rgba(${r}, ${g}, ${b}, 0.1)`,
    border: `rgba(${r}, ${g}, ${b}, 0.15)`
  };
};

export const loadCustomBrands = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('custom-brands')) || {};
    Object.assign(BRANDS, saved);

    const activeCustom = JSON.parse(localStorage.getItem('theme-custom-active-details'));
    if (activeCustom) {
      BRANDS['custom'] = activeCustom;
    }
  } catch (e) {
    console.error("Failed to load custom brands", e);
  }
};

export const saveCustomBrandToList = (key, name, nameEn, hexColor) => {
  const brand = generateBrandColors(hexColor, name, nameEn);
  try {
    const saved = JSON.parse(localStorage.getItem('custom-brands')) || {};
    saved[key] = brand;
    localStorage.setItem('custom-brands', JSON.stringify(saved));
    BRANDS[key] = brand;
    return brand;
  } catch (e) {
    console.error("Failed to save custom brand to list", e);
    return null;
  }
};

export const setActiveCustomBrand = (hexColor, name = 'مخصص', nameEn = 'Custom') => {
  const brand = generateBrandColors(hexColor, name, nameEn);
  try {
    localStorage.setItem('theme-custom-active-details', JSON.stringify(brand));
    BRANDS['custom'] = brand;
    return brand;
  } catch (e) {
    console.error("Failed to set active custom brand", e);
    return null;
  }
};

export const loadCustomBackgrounds = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('custom-backgrounds')) || {};
    Object.assign(BACKGROUNDS, saved);
    const activeCustomBg = JSON.parse(localStorage.getItem('theme-custom-bg-active'));
    if (activeCustomBg) {
      BACKGROUNDS['custom-bg'] = activeCustomBg;
    }
  } catch (e) {
    console.error('Failed to load custom backgrounds', e);
  }
};

export const saveCustomBackgroundToList = (key, name, nameEn, bgColor) => {
  const bgObj = { name, nameEn, bg: bgColor };
  try {
    const saved = JSON.parse(localStorage.getItem('custom-backgrounds')) || {};
    saved[key] = bgObj;
    localStorage.setItem('custom-backgrounds', JSON.stringify(saved));
    BACKGROUNDS[key] = bgObj;
    return bgObj;
  } catch (e) {
    console.error('Failed to save custom background to list', e);
    return null;
  }
};

export const setActiveCustomBackground = (bgColor, name = 'مخصصة', nameEn = 'Custom') => {
  const bgObj = { name, nameEn, bg: bgColor };
  try {
    localStorage.setItem('theme-custom-bg-active', JSON.stringify(bgObj));
    BACKGROUNDS['custom-bg'] = bgObj;
    return bgObj;
  } catch (e) {
    console.error('Failed to set active custom background', e);
    return null;
  }
};

export const deleteCustomBrand = (key) => {
  try {
    const saved = JSON.parse(localStorage.getItem('custom-brands')) || {};
    delete saved[key];
    localStorage.setItem('custom-brands', JSON.stringify(saved));
    delete BRANDS[key];
  } catch (e) {
    console.error('Failed to delete custom brand', e);
  }
};

export const deleteCustomBackground = (key) => {
  try {
    const saved = JSON.parse(localStorage.getItem('custom-backgrounds')) || {};
    delete saved[key];
    localStorage.setItem('custom-backgrounds', JSON.stringify(saved));
    delete BACKGROUNDS[key];
  } catch (e) {
    console.error('Failed to delete custom background', e);
  }
};

// Execute immediately to merge existing custom themes
loadCustomBrands();
loadCustomBackgrounds();
