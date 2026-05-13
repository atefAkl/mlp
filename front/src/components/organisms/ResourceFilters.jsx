import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTableList, faGrip } from '@fortawesome/free-solid-svg-icons';
import Button from '../atoms/Button';

const ResourceFilters = ({ onSearch, onFilterChange }) => {
  return (
    <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search & Bulk */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center text-slate-400">
            <FontAwesomeIcon icon={faSearch} className="text-xs" />
          </span>
          <input
            type="text"
            className="block w-full pl-9 rtl:pr-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" icon={faFilter} className="text-xs py-1.5">
          Filters
        </Button>
      </div>

      {/* Display Tools & Bulk Actions */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <div className="flex bg-slate-100 p-1 rounded border border-slate-200">
          <button className="p-1 px-2 rounded bg-white shadow-sm text-blue-600 text-xs">
            <FontAwesomeIcon icon={faTableList} />
          </button>
          <button className="p-1 px-2 rounded text-slate-400 hover:text-slate-600 text-xs">
            <FontAwesomeIcon icon={faGrip} />
          </button>
        </div>
        
        <select className="bg-white border border-slate-300 rounded text-xs py-1.5 px-2 outline-none focus:ring-1 focus:ring-blue-500">
          <option>Bulk Actions</option>
          <option>Delete Selected</option>
          <option>Activate</option>
        </select>
      </div>
    </div>
  );
};

export default ResourceFilters;
