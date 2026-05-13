import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Input = ({ label, icon, error, ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center text-slate-400 pointer-events-none">
            <FontAwesomeIcon icon={icon} className="text-xs" />
          </span>
        )}
        <input
          {...props}
          className={`block w-full ${icon ? 'pl-9 rtl:pr-9' : 'px-3'} pr-3 rtl:pl-3 py-1.5 text-sm border ${error ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500 smooth-transition`}
        />
      </div>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({ label, icon, options = [], error, ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center text-slate-400 pointer-events-none">
            <FontAwesomeIcon icon={icon} className="text-xs" />
          </span>
        )}
        <select
          {...props}
          className={`block w-full ${icon ? 'pl-9 rtl:pr-9' : 'px-3'} pr-3 rtl:pl-3 py-1.5 text-sm border ${error ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500 smooth-transition appearance-none bg-white`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};
