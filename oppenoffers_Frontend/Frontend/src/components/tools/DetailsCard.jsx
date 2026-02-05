import React from "react";

export function DetailsCard({
  cardTitle,
  statusCode,
  onValidate,
  onModify,
  children,
  Icon,
  disabled
}) {
  
  const stateMap = {
    0: "Archivé",
    1: "Active",
    2: "En Préparation"
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
      <section className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="border-b border-gray-300 bg-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="text-slate-500" size={14} />}
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              {cardTitle}
            </h2>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
              statusCode === 1
                ? "bg-green-100 text-green-700"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {stateMap[statusCode] || "Inconnu"}
          </span>
        </div>
        {children}
        <div className="p-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-2">
          <button
            className="px-2 py-1.5 bg-white border border-gray-300 text-slate-700 rounded text-[10px] font-bold uppercase hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onModify}
            type="button"
          >
            Modifier
          </button>
          <button
            className={`px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${
              disabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-slate-700 text-white hover:bg-slate-800"
            }`}
            onClick={disabled ? undefined : onValidate}
            type="button"
            disabled={disabled}
          >
            Valider
          </button>
        </div>
      </section>
    </aside>
  );
}