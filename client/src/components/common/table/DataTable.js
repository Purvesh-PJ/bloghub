import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Text, Button, Input } from '../../ui/primitives';
import styled from 'styled-components';

const TableContainer = styled(Box)`
  overflow-x: auto;
  border: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  border-radius: ${(p) => p.theme.radii.lg};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${(p) => p.theme.palette.background.surface};
`;

const TableHead = styled.thead`
  background: ${(p) => p.theme.palette.background.subtle};
  border-bottom: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  transition: background ${(p) => p.theme.motion.duration.fast}
    ${(p) => p.theme.motion.easing.standard};

  &:hover {
    background: ${(p) => p.theme.palette.background.subtle};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: ${(p) => p.theme.spacing(4)};
  text-align: ${(p) => p.$align || 'left'};
  font-weight: ${(p) => p.theme.typography.weight.semibold};
  color: ${(p) => p.theme.palette.text.primary};
  font-size: ${(p) => p.theme.typography.size.sm};
  cursor: ${(p) => (p.$sortable ? 'pointer' : 'default')};
  user-select: none;

  &:hover {
    background: ${(p) => (p.$sortable ? p.theme.palette.background.default : 'transparent')};
  }
`;

const TableCell = styled.td`
  padding: ${(p) => p.theme.spacing(4)};
  text-align: ${(p) => p.$align || 'left'};
  color: ${(p) => p.theme.palette.text.secondary};
  font-size: ${(p) => p.theme.typography.size.sm};
  vertical-align: middle;
`;

const SortIcon = styled.span`
  margin-left: ${(p) => p.theme.spacing(1)};
  opacity: ${(p) => (p.$active ? 1 : 0.3)};
  transition: opacity ${(p) => p.theme.motion.duration.fast}
    ${(p) => p.theme.motion.easing.standard};
`;

/**
 * DataTable - A feature-rich data table component
 *
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions {key, label, sortable, align, render}
 * @param {Array} props.data - Array of data objects
 * @param {boolean} props.sortable - Whether table is sortable
 * @param {boolean} props.searchable - Whether to show search
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {React.ReactNode} props.emptyState - Content to show when no data
 * @param {Function} props.onRowClick - Row click handler
 * @param {Object} props.tableProps - Additional props for table container
 */
export const DataTable = ({
  columns = [],
  data = [],
  sortable = true,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyState = 'No data available',
  onRowClick,
  tableProps = {},
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      }),
    );
  }, [data, searchTerm, columns]);

  // Sort data based on sort config
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (columnKey) => {
    if (!sortable) return;

    setSortConfig((prevConfig) => ({
      key: columnKey,
      direction: prevConfig.key === columnKey && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleRowClick = (row, index) => {
    onRowClick?.(row, index);
  };

  return (
    <Box {...tableProps}>
      {/* Search */}
      {searchable && (
        <Box $mb={4}>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  $align={column.align}
                  $sortable={sortable && column.sortable !== false}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <Flex
                    $align="center"
                    $justify={column.align === 'center' ? 'center' : 'flex-start'}
                  >
                    {column.label}
                    {sortable && column.sortable !== false && (
                      <SortIcon $active={sortConfig.key === column.key}>
                        {sortConfig.key === column.key && sortConfig.direction === 'desc'
                          ? '↓'
                          : '↑'}
                      </SortIcon>
                    )}
                  </Flex>
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  style={{ textAlign: 'center', padding: '48px' }}
                >
                  <Text $color="muted">{emptyState}</Text>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  onClick={() => handleRowClick(row, index)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} $align={column.align}>
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func,
    }),
  ),
  data: PropTypes.array,
  sortable: PropTypes.bool,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  emptyState: PropTypes.node,
  onRowClick: PropTypes.func,
  tableProps: PropTypes.object,
};
