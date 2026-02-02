import React from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ searchTerm, setSearchTerm, placeholder }) {
  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-75 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
      />
    </div>
  );
}