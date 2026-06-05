import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-theme-primary-light text-theme-primary',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
