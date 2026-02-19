'use client';

import { useState } from 'react';

interface Filter {
  id: string;
  label: string;
  count?: number;
}

interface EventFiltersProps {
  categories?: Filter[];
  locations?: Filter[];
  onCategoryChange?: (category: string | null) => void;
  onLocationChange?: (location: string | null) => void;
  onDateRangeChange?: (range: string) => void;
}

export function EventFilters({
  categories = [],
  locations = [],
  onCategoryChange,
  onLocationChange,
  onDateRangeChange,
}: EventFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  const handleLocationClick = (locationId: string) => {
    const newLocation = selectedLocation === locationId ? null : locationId;
    setSelectedLocation(newLocation);
    onLocationChange?.(newLocation);
  };

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    onDateRangeChange?.(range);
  };

  const hasActiveFilters = selectedCategory || selectedLocation || selectedDateRange !== 'all';

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLocation(null);
    setSelectedDateRange('all');
    onCategoryChange?.(null);
    onLocationChange?.(null);
    onDateRangeChange?.('all');
  };

  return (
    <div className="space-y-4">
      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Date Range
        </label>
        <div className="flex flex-wrap gap-2">
          {dateRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleDateRangeChange(range.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedDateRange === range.value
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {category.label}
                {category.count !== undefined && (
                  <span className="ml-1 opacity-75">({category.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Locations */}
      {locations.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Locations
          </label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationClick(location.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedLocation === location.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {location.label}
                {location.count !== undefined && (
                  <span className="ml-1 opacity-75">({location.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

