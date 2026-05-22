import React from 'react';
import Button from '../atoms/Button';
import { faPlus, faFileExport, faRefresh, faThLarge, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

const ResourceHeader = ({ title, description, onAdd, onRefresh, viewMode = 'list', onViewChange }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleViewChange = (mode) => {
    if (typeof onViewChange === 'function') {
      onViewChange(mode);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-white p-4 rounded-none border border-slate-200 mb-2">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">{title}</h1>
        {description && (
          <p className="text-xs text-slate-500 max-w-2xl">{description}</p>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* أزرار التبديل بين Grid و List المحمية */}
        {onViewChange && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm mr-1">
            <button
              type="button"
              onClick={() => handleViewChange('list')}
              className={`p-1.5 px-2.5 rounded-md text-xs font-bold transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-theme-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={isRTL ? 'عرض القائمة' : 'List View'}
            >
              <FontAwesomeIcon icon={faList} />
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('grid')}
              className={`p-1.5 px-2.5 rounded-md text-xs font-bold transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-theme-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={isRTL ? 'عرض الشبكة' : 'Grid View'}
            >
              <FontAwesomeIcon icon={faThLarge} />
            </button>
          </div>
        )}

        <Button 
          variant="secondary" 
          icon={faRefresh} 
          onClick={onRefresh} 
          className="p-2.5 rounded-none border-slate-200" 
          tooltip={isRTL ? 'تحديث' : 'Refresh'} 
        />
        
        <Button 
          variant="secondary" 
          icon={faFileExport} 
          className="text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-none border-slate-200 bg-slate-50"
        >
          {isRTL ? 'تصدير' : 'Export'}
        </Button>
        
        {onAdd && (
          <Button 
            variant="primary" 
            icon={faPlus} 
            onClick={onAdd} 
            className="text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-none"
          >
            {isRTL ? 'إضافة جديد' : 'Add New'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResourceHeader;