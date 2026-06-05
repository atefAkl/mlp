import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatsCard = ({ title, value, icon, color = 'blue', trend = null }) => {
  const colors = {
    blue: 'bg-theme-primary-light text-theme-primary border-theme-border-accent',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className={`flex items-center p-3 rounded border shadow-sm bg-white smooth-transition hover:shadow-md`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${colors[color]}`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="mx-3 flex-1">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-bold text-slate-800">{value}</h3>
          {trend && (
            <span className={`text-[10px] font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
