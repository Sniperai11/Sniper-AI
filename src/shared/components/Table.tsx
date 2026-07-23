import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  emptyText?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyText = 'لا توجد سجلات متاحة حالياً',
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 custom-scrollbar" dir="rtl">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-3.5 ${col.align === 'center' ? 'text-center' : col.align === 'left' ? 'text-left' : 'text-right'} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>جاري تحميل السجلات...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-slate-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-slate-800/40 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`p-3.5 text-slate-200 ${col.align === 'center' ? 'text-center' : col.align === 'left' ? 'text-left' : 'text-right'} ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
