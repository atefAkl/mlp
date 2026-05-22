import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const SelectionBanner = ({
  selectedCount,
  currentPageCount,
  totalFilteredCount,
  onSelectAllFiltered,
  onClearSelection
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Only show the banner if something is selected and there's a difference between page count and total filtered count
  if (selectedCount === 0 || totalFilteredCount <= currentPageCount) {
    return null;
  }

  const isAllFilteredSelected = selectedCount === totalFilteredCount;
  const isAllPageSelected = selectedCount === currentPageCount;

  if (!isAllPageSelected && !isAllFilteredSelected) {
    return null;
  }

  return (
    <div 
      className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 p-2.5 px-4 rounded-xl text-xs flex flex-col sm:flex-row items-center justify-center gap-2 text-blue-700 animate-in fade-in slide-in-from-top-1 smooth-transition"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={isAllFilteredSelected ? faCheckCircle : faInfoCircle} className="text-blue-500" />
        <span>
          {isAllFilteredSelected ? (
            isRTL 
              ? `تم تحديد جميع الـ ${totalFilteredCount} عناصر (عبر كافة الصفحات).` 
              : `All ${totalFilteredCount} items are selected (across all pages).`
          ) : (
            isRTL 
              ? `تم تحديد جميع الـ ${selectedCount} عناصر في هذه الصفحة.` 
              : `All ${selectedCount} items on this page are selected.`
          )}
        </span>
      </div>

      {!isAllFilteredSelected ? (
        <button
          type="button"
          onClick={onSelectAllFiltered}
          className="font-bold underline hover:text-blue-900 transition-all ml-1 rtl:mr-1 rtl:ml-0"
        >
          {isRTL 
            ? `تحديد جميع الـ ${totalFilteredCount} عناصر المطابقة لهذا البحث` 
            : `Select all ${totalFilteredCount} items matching this search`}
        </button>
      ) : (
        <button
          type="button"
          onClick={onClearSelection}
          className="font-bold underline hover:text-blue-900 transition-all ml-1 rtl:mr-1 rtl:ml-0"
        >
          {isRTL ? "إلغاء التحديد" : "Clear selection"}
        </button>
      )}
    </div>
  );
};

export default SelectionBanner;
