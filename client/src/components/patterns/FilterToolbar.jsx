import React from 'react';
import { Card, Chip, Select, SearchInput } from '../ui';
import { cn } from '../../lib/utils';

/**
 * FilterToolbar — Composed pattern combining filter chips, sort dropdown,
 * and search input into a responsive, standard toolbar for management and explore views.
 */
export function FilterToolbar({
  filters = [],
  activeFilter,
  onFilterChange,
  sortOptions = [],
  sortValue,
  onSortChange,
  sortAriaLabel = 'Sort options',
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = 'Search…',
  searchAriaLabel = 'Search',
  children,
  className,
}) {
  const hasFilters = filters.length > 0;
  const hasSort = sortOptions.length > 0;
  const hasSearch = typeof searchValue === 'string' && typeof onSearchChange === 'function';

  return (
    <Card
      tone="low"
      radius="xl"
      padding="md"
      bordered
      className={cn('flex items-center gap-2.5 flex-wrap mb-4', className)}
    >
      {/* 1. Filter Chips */}
      {hasFilters &&
        filters.map((option) => {
          const isSelected = activeFilter === option.id;
          const countLabel =
            typeof option.count === 'number' && option.count > 0 ? ` (${option.count})` : '';

          return (
            <Chip key={option.id} selected={isSelected} onClick={() => onFilterChange?.(option.id)}>
              {option.label}
              {countLabel}
            </Chip>
          );
        })}

      {/* 2. Sort Dropdown */}
      {hasSort && (
        <div className="w-[180px] max-sm:w-full">
          <Select
            options={sortOptions}
            value={sortValue}
            onValueChange={onSortChange}
            aria-label={sortAriaLabel}
            density="compact"
          />
        </div>
      )}

      {/* 3. Search Field */}
      {hasSearch && (
        <div className="flex-1 min-w-[200px] max-w-[320px] ml-auto max-sm:ml-0 max-sm:max-w-full">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onClear={() => {
              if (onSearchClear) onSearchClear();
              else onSearchChange?.('');
            }}
            ariaLabel={searchAriaLabel}
            density="compact"
          />
        </div>
      )}

      {/* 4. Slot for custom actions or trailing content */}
      {children}
    </Card>
  );
}
