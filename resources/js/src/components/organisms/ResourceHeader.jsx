import React from 'react';
import Button from '../atoms/Button';
import { faPlus, faFileExport, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const ResourceHeader = ({ title, onAdd, onRefresh }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="secondary" icon={faRefresh} onClick={onRefresh} className="p-2.5 rounded-xl border-slate-200" tooltip={t('auto.refresh')} />
        <Button variant="secondary" icon={faFileExport} className="text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border-slate-200 bg-slate-50">
          {t('auto.export')}
        </Button>
        {onAdd && (
          <Button variant="primary" icon={faPlus} onClick={onAdd} className="text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-blue-100">
            {t('auto.add_new')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResourceHeader;
