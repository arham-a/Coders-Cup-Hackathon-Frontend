'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface Column {
  header: string;
  accessor: string | ((row: any) => ReactNode);
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  currentPage?: number;
  itemsPerPage?: number;
}

export function DataTable({ columns, data, currentPage = 1, itemsPerPage = 10 }: DataTableProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const getCellValue = (row: any, column: Column) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-400 to-amber-500 border-b border-orange-500">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
