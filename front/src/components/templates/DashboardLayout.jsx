import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGaugeHigh, 
  faUsers, 
  faUser, 
  faSignOutAlt, 
  faChevronRight,
  faChevronLeft,
  faGear,
  faUserShield,
  faKey,
  faChevronDown
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
      ]
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-e border-slate-200 smooth-transition flex flex-col z-30`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen && <span className="font-bold text-xl text-blue-600">STITCH</span>}
          <Button 
            variant="ghost" 
            icon={sidebarOpen ? (isRTL ? faChevronRight : faChevronLeft) : (isRTL ? faChevronLeft : faChevronRight)} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1"
          />
        </div>
        
        <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              {group.label && sidebarOpen && (
                <button 
                  onClick={() => toggleMenu(group.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span>{group.label}</span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`smooth-transition ${openMenus.includes(group.id) ? '' : '-rotate-90 rtl:rotate-90'}`} 
                  />
                </button>
              )}
              
              {(group.id === 'main' || openMenus.includes(group.id) || !sidebarOpen) && (
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center p-2 rounded smooth-transition ${
                        location.pathname === item.path 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className={`${sidebarOpen ? 'me-3' : ''} w-5`} />
                      {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-slate-200">
          <Link
            to="/dashboard/profile"
            className={`flex items-center p-2 rounded smooth-transition ${
              location.pathname === '/dashboard/profile' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FontAwesomeIcon icon={faUser} className={`${sidebarOpen ? 'me-3' : ''} w-5`} />
            {sidebarOpen && <span className="text-sm font-medium">{t('common.profile')}</span>}
          </Link>
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center p-2 rounded text-red-600 hover:bg-red-50 smooth-transition"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className={`${sidebarOpen ? 'me-3' : ''} w-5`} />
            {sidebarOpen && <span className="text-sm font-medium">{t('common.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-4">
             <div className="text-sm text-slate-500 font-medium">
               {t('common.dashboard')} {location.pathname !== '/dashboard' && <span className="mx-2 text-slate-300">/</span>} 
               {location.pathname !== '/dashboard' && <span className="text-blue-600">{location.pathname.split('/').pop()}</span>}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              onClick={() => i18n.changeLanguage(isRTL ? 'en' : 'ar')}
              className="px-3 py-1 text-xs font-bold"
            >
              {isRTL ? 'English' : 'العربية'}
            </Button>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm border border-blue-200">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
