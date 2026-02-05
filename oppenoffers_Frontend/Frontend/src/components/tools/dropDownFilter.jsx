import React from 'react';
import { Filter, CheckCircle, Archive, Loader2 } from 'lucide-react';

const statusFilterList = [
  {
    value: 1,
    label: 'Actives',
    icon: CheckCircle,
    activeColor: 'text-blue-700',
    activeBg: 'bg-blue-50',
    activeIcon: 'text-blue-600',
    inactiveIcon: 'text-gray-300',
    hover: 'hover:bg-blue-50',
    focus: 'focus:bg-blue-100',
    count: (operations, fadeOutOps) =>
      operations.filter(op => Number(op.StateCode) === 1 && !fadeOutOps[op.NumOperation]).length,
  },
  {
    value: 0,
    label: 'Archivées',
    icon: Archive,
    activeColor: 'text-orange-700',
    activeBg: 'bg-orange-50',
    activeIcon: 'text-orange-600',
    inactiveIcon: 'text-gray-300',
    hover: 'hover:bg-orange-50',
    focus: 'focus:bg-orange-100',
    count: (operations) =>
      operations.filter(op => Number(op.StateCode) === 0).length,
  },
  {
    value: 2,
    label: 'En Préparation',
    icon: Loader2,
    activeColor: 'text-violet-700',
    activeBg: 'bg-violet-50',
    activeIcon: 'text-violet-500',
    inactiveIcon: 'text-gray-300',
    hover: 'hover:bg-violet-50',
    focus: 'focus:bg-violet-100',
    count: (operations) =>
      operations.filter(op => Number(op.StateCode) === 2).length,
  }
];

const filterLabelByStatus = (status) => {
  if (status === 1) return 'Actives';
  if (status === 0) return 'Archivées';
  if (status === 2) return 'En Préparation';
  return 'Toutes';
};

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
            {filterLabelByStatus(filterStatus)}
          </span>
        </button>
        {showFilterDropdown && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden text-left text-xs">
            {statusFilterList.map((option) => {
              const isActive = filterStatus === option.value;
              const Icon = option.icon;
              let entryCount = 0;
              if (option.value === 1) {
                entryCount = option.count(operations, fadeOutOps);
              } else {
                entryCount = option.count(operations, fadeOutOps);
              }
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilterStatus(option.value);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 transition ${option.hover} ${option.focus} ${isActive ? option.activeBg + ' ' + option.activeColor : 'text-gray-700'}`}
                  style={{ fontSize: '0.83rem' }}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isActive ? option.activeIcon : option.inactiveIcon}`}
                  />
                  <span className="font-medium">{option.label}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    ({entryCount})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDownFilter;