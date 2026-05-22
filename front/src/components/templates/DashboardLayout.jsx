import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope,
  faGaugeHigh, 
  faUsers, 
  faUser, 
  faSignOutAlt, 
  faChevronRight,
  faChevronLeft,
  faGear,
  faUserShield,
  faKey,
  faChevronDown,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import Button from '../atoms/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const DashboardLayout = () => {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState(['settings']);
  const location = useLocation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';

  const [activeTheme, setActiveTheme] = useState('beige');

  const themes = {
    beige: {
      name: isRTL ? 'بيج كلاسيكي' : 'Classic Beige',
      bgPage: '#f6f4eb',
      primary: '#1e3a8a',
      primaryHover: '#172554',
      primaryLight: '#eff6ff',
      shadow: 'rgba(30, 58, 138, 0.1)',
      borderAccent: 'rgba(30, 58, 138, 0.15)',
    },
    sand: {
      name: isRTL ? 'رمل ذهبي' : 'Golden Sand',
      bgPage: '#f2eae1',
      primary: '#b45309',
      primaryHover: '#78350f',
      primaryLight: '#fef3c7',
      shadow: 'rgba(180, 83, 9, 0.1)',
      borderAccent: 'rgba(180, 83, 9, 0.15)',
    },
    sage: {
      name: isRTL ? 'زيتون هادئ' : 'Nordic Sage',
      bgPage: '#e9ece6',
      primary: '#0f766e',
      primaryHover: '#115e59',
      primaryLight: '#f0fdfa',
      shadow: 'rgba(15, 118, 110, 0.1)',
      borderAccent: 'rgba(15, 118, 110, 0.15)',
    },
    terracotta: {
      name: isRTL ? 'آجر دافئ' : 'Warm Terracotta',
      bgPage: '#f5ece9',
      primary: '#c2410c',
      primaryHover: '#9a3412',
      primaryLight: '#fff7ed',
      shadow: 'rgba(194, 65, 12, 0.1)',
      borderAccent: 'rgba(194, 65, 12, 0.15)',
    },
    parchment: {
      name: isRTL ? 'بردي عتيق' : 'Vintage Parchment',
      bgPage: '#f0ede4',
      primary: '#4b5320',
      primaryHover: '#3b401a',
      primaryLight: '#f6f5f0',
      shadow: 'rgba(75, 83, 32, 0.1)',
      borderAccent: 'rgba(75, 83, 32, 0.15)',
    }
  };

  const changeTheme = (themeKey) => {
    const theme = themes[themeKey] || themes.beige;
    setActiveTheme(themeKey);
    const root = document.documentElement;
    root.style.setProperty('--theme-bg-page', theme.bgPage);
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-primary-hover', theme.primaryHover);
    root.style.setProperty('--theme-primary-light', theme.primaryLight);
    root.style.setProperty('--theme-shadow', theme.shadow);
    root.style.setProperty('--theme-border-accent', theme.borderAccent);
    localStorage.setItem('active-theme', themeKey);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('active-theme');
    if (savedTheme && themes[savedTheme]) {
      changeTheme(savedTheme);
    } else {
      changeTheme('beige');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const menuGroups = [
    {
      id: 'main',
      label: null,
      items: [
        { id: 'dashboard', name: t('common.dashboard'), icon: faGaugeHigh, path: '/dashboard' },
        { id: 'users', name: t('common.users'), icon: faUsers, path: '/dashboard/users' },
      ]
    },
    {
      id: 'settings',
      label: isRTL ? 'الإعدادات' : 'Settings',
      icon: faGear,
      items: [
        { id: 'roles', name: isRTL ? 'الأدوار' : 'Roles', icon: faUserShield, path: '/dashboard/roles' },
        { id: 'permissions', name: isRTL ? 'الصلاحيات' : 'Permissions', icon: faKey, path: '/dashboard/permissions' },
        { 
  id: 'subscribers', 
  name: isRTL ? 'المشتركين' : 'Subscribers', 
  icon: faEnvelope, 
  path: '/dashboard/subscribers' 
},
      ]
    }
  ];

  // Helper to get breadcrumb label
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return null;
    const parts = path.split('/').filter(p => p && p !== 'dashboard');
    return parts.map(part => {
        // Simple mapping or translation
        if (part === 'users') return isRTL ? 'المستخدمين' : 'Users';
        if (part === 'roles') return isRTL ? 'الأدوار' : 'Roles';
        if (part === 'permissions') return isRTL ? 'الصلاحيات' : 'Permissions';
        if (part === 'subscribers') return isRTL ? 'المشتركين' : 'Subscribers';
        return part;
    });
  };

  const breadcrumbItems = getBreadcrumb();

  return (
    <div className="min-h-screen flex bg-theme-bg-page transition-colors duration-500 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar - Fixed Height and Sticky */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-e border-slate-200 smooth-transition flex flex-col h-screen sticky top-0 z-50`}
      >
        <div className="h-16 flex-shrink-0 p-4 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen && <span className="font-black text-2xl text-theme-primary tracking-tighter transition-colors duration-500">MAWTHIQ</span>}
          <Button 
            variant="ghost" 
            icon={sidebarOpen ? (isRTL ? faChevronRight : faChevronLeft) : (isRTL ? faChevronLeft : faChevronRight)} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-slate-50"
          />
        </div>
        
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              {group.label && sidebarOpen && (
                <button 
                  onClick={() => toggleMenu(group.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span>{group.label}</span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`smooth-transition text-[8px] ${openMenus.includes(group.id) ? '' : '-rotate-90 rtl:rotate-90'}`} 
                  />
                </button>
              )}
              
              {(group.id === 'main' || openMenus.includes(group.id) || !sidebarOpen) && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center p-2.5 rounded-xl smooth-transition ${
                          isActive 
                            ? 'bg-theme-primary text-white shadow-lg shadow-theme-shadow' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-theme-primary'
                        }`}
                      >
                        <FontAwesomeIcon icon={item.icon} className={`${sidebarOpen ? (isRTL ? 'ml-3' : 'mr-3') : ''} w-5 text-sm`} />
                        {sidebarOpen && <span className="text-xs font-bold">{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-1">
          <Link
            to="/dashboard/profile"
            className={`flex items-center p-2.5 rounded-xl smooth-transition ${
              location.pathname === '/dashboard/profile' 
                ? 'bg-theme-primary-light text-theme-primary' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FontAwesomeIcon icon={faUser} className={`${sidebarOpen ? (isRTL ? 'ml-3' : 'mr-3') : ''} w-5 text-sm`} />
            {sidebarOpen && <span className="text-xs font-bold">{t('common.profile')}</span>}
          </Link>
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center p-2.5 rounded-xl text-red-500 hover:bg-red-50 smooth-transition"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className={`${sidebarOpen ? (isRTL ? 'ml-3' : 'mr-3') : ''} w-5 text-sm`} />
            {sidebarOpen && <span className="text-xs font-bold">{t('common.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header - Fixed/Sticky with Glassmorphism */}
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 text-xs font-bold">
                <Link to="/dashboard" className="text-slate-400 hover:text-theme-primary smooth-transition">
                  <FontAwesomeIcon icon={faHome} className="text-sm" />
                </Link>
                {breadcrumbItems?.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <FontAwesomeIcon icon={isRTL ? faChevronLeft : faChevronRight} className="text-[8px] text-slate-300" />
                    <span className={idx === breadcrumbItems.length - 1 ? "text-theme-primary font-black" : "text-slate-400"}>
                      {item}
                    </span>
                  </React.Fragment>
                ))}
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dynamic Theme Picker */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200 shadow-inner">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => changeTheme(key)}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 relative group flex items-center justify-center ${
                    activeTheme === key 
                      ? 'border-slate-800 scale-110 shadow-sm' 
                      : 'border-white hover:scale-105 hover:shadow-xs'
                  }`}
                  style={{ backgroundColor: theme.bgPage }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                  {/* Tooltip */}
                  <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-sm">
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => i18n.changeLanguage(isRTL ? 'en' : 'ar')}
              className="text-[10px] font-black text-slate-500 hover:text-theme-primary border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 smooth-transition uppercase tracking-tighter"
            >
              {isRTL ? 'English' : 'العربية'}
            </button>
            <div className="flex items-center gap-2 pl-4 border-s border-slate-200">
               <div className="text-end hidden sm:block">
                  <div className="text-[11px] font-black text-slate-800 leading-none mb-0.5">Admin User</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrator</div>
               </div>
               <div className="w-10 h-10 rounded-2xl bg-theme-primary shadow-lg shadow-theme-shadow flex items-center justify-center text-white font-black text-sm border border-theme-border-accent transition-colors duration-500">
                A
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
