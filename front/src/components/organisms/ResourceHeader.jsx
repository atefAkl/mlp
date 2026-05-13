import React from 'react';
import Breadcrumbs from '../molecules/Breadcrumbs';
import Button from '../atoms/Button';
import { faPlus, faFileExport, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const ResourceHeader = ({ title, breadcrumbs, onAdd, onRefresh }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded shadow-sm border border-slate-200">
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="secondary" icon={faRefresh} onClick={onRefresh} className="p-1.5" tooltip={isRTL ? 'تحديث' : 'Refresh'} />
        <Button variant="secondary" icon={faFileExport} className="text-xs">
          {isRTL ? 'تصدير' : 'Export'}
        </Button>
        {onAdd && (
          <Button variant="primary" icon={faPlus} onClick={onAdd} className="text-xs">
            {isRTL ? 'إضافة جديد' : 'Add New'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResourceHeader;
