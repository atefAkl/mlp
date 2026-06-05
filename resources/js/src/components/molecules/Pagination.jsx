import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const Pagination = ({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2" dir={t('auto.ltr')}>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {isRTL ? (
          <>عرض <span className="text-slate-800">{Math.min(itemsPerPage, totalItems)}</span> من <span className="text-slate-800">{totalItems}</span> عنصر</>
        ) : (
          <>Showing <span className="text-slate-800">{Math.min(itemsPerPage, totalItems)}</span> of <span className="text-slate-800">{totalItems}</span> items</>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent smooth-transition"
        >
          <FontAwesomeIcon icon={isRTL ? faAnglesRight : faAnglesLeft} className="text-[10px]" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 smooth-transition"
        >
          <FontAwesomeIcon icon={isRTL ? faChevronRight : faChevronLeft} className="text-[10px]" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black smooth-transition ${
                currentPage === number 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 border-blue-600' 
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-300'
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 smooth-transition"
        >
          <FontAwesomeIcon icon={isRTL ? faChevronLeft : faChevronRight} className="text-[10px]" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 smooth-transition"
        >
          <FontAwesomeIcon icon={isRTL ? faAnglesLeft : faAnglesRight} className="text-[10px]" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
