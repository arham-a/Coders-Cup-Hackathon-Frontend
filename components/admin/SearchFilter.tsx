'use client';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: { value: string; label: string }[];
  searchPlaceholder?: string;
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  searchPlaceholder = 'Search...'
}: SearchFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm sm:text-base"
          />
        </div>

        {/* Filter */}
        <CustomDropdown
          options={filterOptions}
          value={filterValue}
          onChange={onFilterChange}
          placeholder="Filter by status..."
        />
      </div>
    </motion.div>
  );
}
