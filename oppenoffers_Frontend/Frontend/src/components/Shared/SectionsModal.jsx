import React from 'react';
import DropDownFilter from './dropDownFilter';
import { SearchBar } from './tools/SearchBar';
import { Plus } from 'lucide-react';

const colorMap = {
  "Lots": "w-0.5 h-4 border-blue-500 border-l-2",
  "Cahiers de Charges": "w-1 h-3 border-emerald-500 border-l-2",
};

export const SectionsModal = ({
  title,
  icon,
  buttonText,
  showSearch = false,
  showFilter = false,
  onButtonClick,
  onSearch,
  onFilterChange,
  children,
  showButton = true
}) => {
  const color = colorMap[title] || "border-gray-300";

  return (
    <section className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
      <div className="border-b border-gray-300 bg-gray-100 px-6 py-2 flex items-center gap-2">
      <div className="w-1 h-3 border-emerald-500 border-l-2" />
      <span className="text-slate-500">{icon}</span>
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {showFilter && <DropDownFilter onChange={onFilterChange} />}
          {showButton && (
            <button
              onClick={onButtonClick}
              className={"flex items-center gap-1 px-2 py-1 text-blue-700 rounded text-xs font-semibold hover:bg-blue-50 cursor-pointer"}
            >
              <span className="flex items-center gap-1">
                <Plus className="w-4 h-4 text-blue-500" />
                {buttonText}
              </span>
            </button>
          )}
        </div>
        {/* Left side controls */}
        {showSearch && (
          <div className="ml-4 flex items-center">
            <SearchBar onSearch={onSearch} />
          </div>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </section>
  );
};
