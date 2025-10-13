import React from 'react';
import { SearchInput } from '../../../components/ui/primitives';

export const TableGlobalFilter = ({
  globalFilter,
  setGlobalFilter,
  placeholder = 'Search...',
  ...props
}) => {
  return (
    <SearchInput
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder={placeholder}
      {...props}
    />
  );
};
