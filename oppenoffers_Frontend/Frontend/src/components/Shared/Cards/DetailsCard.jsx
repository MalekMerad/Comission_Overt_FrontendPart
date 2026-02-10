import React from "react";
import { CheckCircle, XCircle, Clock, Archive } from "lucide-react";

export function DetailsCard({
  cardTitle,
  statusCode,
  onValidate,
  onModify,
  children,
  leading,
  Icon,
  disabled
}) {
  
  const statusConfig = {
    0: {
      label: "Archivé",
      className: "bg-red-100 text-red-700",
      Icon: Archive,
    },
    1: {
      label: "Active",
      className: "bg-green-100 text-green-700",
      Icon: CheckCircle,
    },
    2: {
      label: "En Préparation",
      className: "bg-yellow-100 text-yellow-700",
      Icon: Clock,
    },
  };

  const status = statusConfig[statusCode] || {
    label: "Inconnu",
    className: "bg-gray-200 text-gray-600",
    Icon: XCircle,
  };

  const StatusIcon = status.Icon;


  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
      <section className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="border-b border-gray-300 bg-gray-100 px-4 py-2 flex items-center justify-between min-h-[40px]">
          <div className="flex items-center gap-2">
            {leading}
            {Icon && <Icon className="text-slate-500" size={12} />}
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight leading-tight">
              {cardTitle}
            </h2>
          </div>
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${status.className}`}
          >
            <StatusIcon size={12} />
            {status.label}
          </span>
        </div>
        {children}
        <div className="p-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-2">
          <button
            className="px-2 py-1.5 bg-white border border-gray-300 text-slate-700 rounded text-[10px] font-bold uppercase hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            onClick={onModify}
            type="button"
          >
            Modifier
          </button>
          <button
            className={`px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
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