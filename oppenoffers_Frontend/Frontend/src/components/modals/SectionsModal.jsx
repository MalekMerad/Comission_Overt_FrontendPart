import React from 'react';
import DropDownFilter from '../tools/dropDownFilter';
import { SearchBar } from '../tools/SearchBar';
import { Plus } from 'lucide-react';

const colorMap = {
  "Lots": "border-blue-500",
  "Annonces": "border-amber-500",
  "Fournisseurs": "border-emerald-500",
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
}) => {
  const color = colorMap[title] || "border-gray-300";

  return (
    <section className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
      <div className="border-b border-gray-300 bg-gray-100 px-6 py-2 flex items-center gap-2">
        <div className={`w-1 h-3 ${color} border-l-2`} />
        <span className="text-slate-500">{icon}</span>
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex-1" />
        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {showFilter && <DropDownFilter onChange={onFilterChange} />}
          {buttonText && (
            <button
              onClick={onButtonClick}
              className="text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors bg-transparent p-0 cursor-pointer hover:bg-gray-100"
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
