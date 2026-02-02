import React from 'react';
import { Filter, CheckCircle, Archive } from 'lucide-react';

const DropDownFilter = ({
  filterStatus,
  setFilterStatus,
  showFilterDropdown,
  setShowFilterDropdown,
  operations = [],
  fadeOutOps = {},
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-xs hover:bg-gray-50 text-gray-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-medium tracking-tight">
            {filterStatus === 1 ? 'Actives' : 'Archivées'}
          </span>
        </button>
        {showFilterDropdown && (
          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden text-left text-xs">
            <button
              onClick={() => { 
                setFilterStatus(1); 
                setShowFilterDropdown(false); 
              }}
              className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-blue-50 focus:bg-blue-100 transition ${filterStatus === 1 ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
              style={{ fontSize: '0.83rem' }}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${filterStatus === 1 ? 'text-blue-600' : 'text-gray-300'}`} />
              <span className="font-medium">Actives</span>
              <span className="ml-auto text-xs text-gray-500">
                ({operations.filter(op => Number(op.StateCode) === 1 && !fadeOutOps[op.NumOperation]).length})
              </span>
            </button>
            <button
              onClick={() => { 
                setFilterStatus(0); 
                setShowFilterDropdown(false); 
              }}
              className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-orange-50 focus:bg-orange-100 transition ${filterStatus === 0 ? 'bg-orange-50 text-orange-700' : 'text-gray-700'}`}
              style={{ fontSize: '0.83rem' }}
            >
              <Archive className={`w-3.5 h-3.5 ${filterStatus === 0 ? 'text-orange-600' : 'text-gray-300'}`} />
              <span className="font-medium">Archivées</span>
              <span className="ml-auto text-xs text-gray-500">
                ({
                  operations.filter(op => Number(op.StateCode) === 0).length
                })
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDownFilter;