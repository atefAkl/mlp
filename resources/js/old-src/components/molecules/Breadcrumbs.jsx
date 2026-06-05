import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const Breadcrumbs = ({ items = [] }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const ChevronIcon = isRTL ? faChevronLeft : faChevronRight;

  return (
    <nav className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-slate-500 mb-1">
      <Link to="/dashboard" className="hover:text-theme-primary smooth-transition">
        <FontAwesomeIcon icon={faHome} className="mr-1 rtl:ml-1" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FontAwesomeIcon icon={ChevronIcon} className="text-[10px] opacity-50" />
          {item.path ? (
            <Link to={item.path} className="hover:text-theme-primary smooth-transition">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-800">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
