import { Download, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BudgetDataTable({
  title,
  titleIcon: TitleIcon,
  columns,
  rows,
  onAddClick,
  onStatusClick,
  onDownloadClick,
  onRowDownloadClick,
  onRowClick,
  selectedRowId
}) {
  const { t } = useTranslation();

  const renderStatusBadge = (status, row, columnKey) => {
    const statusConfig = {
      Pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        dot: 'bg-yellow-500',
        label: t('budget.statusLabels.pending')
      },
      Validated: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300',
        dot: 'bg-green-500',
        label: t('budget.statusLabels.validated')
      },
      Completed: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-300',
        dot: 'bg-blue-500',
        label: t('budget.statusLabels.completed')
      },
      DEBIT: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        dot: 'bg-red-500',
        label: 'Debit'
      },
      CREDIT: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-800 dark:text-emerald-300',
        dot: 'bg-emerald-500',
        label: 'Credit'
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      dot: 'bg-gray-400',
      label: status
    };

    const isClickable = onStatusClick && columnKey === 'status' && status === 'Pending';

    return (
      <span
        onClick={(event) => {
          event.stopPropagation();
          if (isClickable) onStatusClick(row, columnKey);
        }}
        className={`inline-flex items-center gap-1 font-medium transition-all px-1 py-0.5 text-[10px] rounded-md ${config.bg} ${config.text} ${isClickable ? 'cursor-pointer hover:ring-1 hover:ring-current' : ''
          }`}
      >
        <span className={`w-1 h-1 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    );
  };

  // Helper to format amount if needed
  const formatAmount = (value) => {
    if (typeof value === 'string' && value.includes('DZD')) return value;
    if (typeof value === 'number') return `${value.toLocaleString()} DZD`;
    return value;
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden flex flex-col h-full w-full">
      <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/30 flex justify-between items-center min-h-[44px]">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          {TitleIcon && <TitleIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
          {title}
        </h3>
        {(onAddClick || onDownloadClick) && (
          <div className="flex items-center gap-1.5">
            {onAddClick && (
              <button
                onClick={onAddClick}
                className="group p-1 rounded bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
                style={{ width: '22px', height: '22px', minWidth: '22px', minHeight: '22px' }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
            {onDownloadClick && (
              <button
                onClick={onDownloadClick}
                className="group p-1 rounded bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white transition-colors"
                style={{ width: '22px', height: '22px', minWidth: '22px', minHeight: '22px' }}
                title={t('budget.download') || 'Download'}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        {!onAddClick && !onDownloadClick && <div className="w-[22px]"></div>}
      </div>

      {/* Make table scroll horizontally on small screens, full width on large */}
      <div className="overflow-x-auto flex-1 w-full">
        <table className="min-w-full w-full text-xs">
          <thead className="bg-gray-50 dark:bg-slate-800/40 border-b border-gray-200 dark:border-slate-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 py-1.5 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {onRowDownloadClick && (
                <th className="px-3 py-1.5 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('budget.download') || 'Download'}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800">
            {rows.map((row, index) => (
              <tr
                key={row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''} ${selectedRowId === row.id ? 'bg-blue-50 dark:bg-slate-800/70' : ''}`}
              >
                {columns.map((column) => {
                  let cellValue = row[column.key];

                  if (column.key === 'amount' || column.key === 'paymentTotal') {
                    cellValue = formatAmount(cellValue);
                  }

                  if (column.key === 'status' || column.key === 'type' || column.key === 'Type' || column.key === 'treasuryReference') {
                    return (
                      <td key={`${column.key}-${index}`} className="px-3 py-1.5 text-left">
                        {renderStatusBadge(cellValue, row, column.key)}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={`${column.key}-${index}`}
                      className="px-3 py-1.5 text-left text-[11px] text-slate-700 dark:text-slate-200"
                    >
                      {cellValue || '—'}
                    </td>
                  );
                })}
                {onRowDownloadClick && (
                  <td className="px-3 py-1.5 text-left">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onRowDownloadClick(row);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 text-[10px] font-semibold transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      {t('budget.download') || 'Download'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}