import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTableList, faGrip, faThLarge, faListUl, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Button from '../atoms/Button';
import { useTranslation } from 'react-i18next';

const ResourceFilters = ({ 
  onSearch, 
  onViewChange, 
  currentView, 
  onBulkAction, 
  selectedCount 
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search & Bulk */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <span className={`absolute inset-y-0 flex items-center text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`}>
            <FontAwesomeIcon icon={faSearch} className="text-xs" />
          </span>
          <input
            type="text"
            className={`block w-full py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            placeholder={isRTL ? 'بحث...' : 'Search...'}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" icon={faFilter} className="text-[10px] font-bold py-1.5 px-3 uppercase tracking-wider">
          {isRTL ? 'تصفية' : 'Filters'}
        </Button>
      </div>

      {/* Display Tools & Bulk Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* View Switcher */}
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => onViewChange('list')}
            className={`p-1.5 px-2.5 rounded-md transition-all ${currentView === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FontAwesomeIcon icon={faListUl} className="text-xs" />
          </button>
          <button 
            onClick={() => onViewChange('grid')}
            className={`p-1.5 px-2.5 rounded-md transition-all ${currentView === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FontAwesomeIcon icon={faThLarge} className="text-xs" />
          </button>
        </div>
        
        {/* Bulk Actions Dropdown */}
        <div className="relative">
          <select 
            disabled={selectedCount === 0}
            className={`appearance-none bg-white border border-slate-200 rounded-lg text-[10px] font-bold py-2 px-4 pr-8 outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-50 smooth-transition uppercase tracking-wider cursor-pointer`}
            onChange={(e) => onBulkAction(e.target.value)}
            value=""
          >
            <option value="" disabled>{isRTL ? 'العمليات الجماعية' : 'Bulk Actions'}</option>
            <option value="delete" className="text-red-600">{isRTL ? 'حذف المحدد' : 'Delete Selected'}</option>
            <option value="activate">{isRTL ? 'تنشيط' : 'Activate'}</option>
          </select>
          <div className={`pointer-events-none absolute inset-y-0 flex items-center px-2 text-slate-400 ${isRTL ? 'left-1' : 'right-1'}`}>
            <FontAwesomeIcon icon={faChevronDown} className="text-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceFilters;
