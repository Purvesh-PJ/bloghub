import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Button, Text, Select } from '../../ui/primitives';

/**
 * TablePagination - A pagination component for tables
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current page number (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemsPerPage - Items per page
 * @param {Function} props.onPageChange - Page change handler
 * @param {Function} props.onItemsPerPageChange - Items per page change handler
 * @param {Array} props.pageSizeOptions - Available page size options
 * @param {boolean} props.showPageSizeSelector - Whether to show page size selector
 * @param {boolean} props.showItemCount - Whether to show item count
 * @param {Object} props.containerProps - Additional props for container
 */
export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSizeSelector = true,
  showItemCount = true,
  containerProps = {},
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    onItemsPerPageChange?.(newItemsPerPage);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page range, and last page
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1 && !showPageSizeSelector && !showItemCount) {
    return null;
  }

  return (
    <Flex $align="center" $justify="space-between" $gap={4} $wrap {...containerProps}>
      {/* Items per page selector */}
      {showPageSizeSelector && (
        <Flex $align="center" $gap={2}>
          <Text $fontSize="sm" $color="secondary">
            Show
          </Text>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{ width: 'auto', minWidth: '80px' }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <Text $fontSize="sm" $color="secondary">
            per page
          </Text>
        </Flex>
      )}

      {/* Item count */}
      {showItemCount && (
        <Text $fontSize="sm" $color="secondary">
          Showing {startItem}-{endItem} of {totalItems} items
        </Text>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Flex $align="center" $gap={1}>
          {/* Previous button */}
          <Button
            $variant="ghost"
            $size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ←
          </Button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <Text $px={2} $color="muted">
                  ...
                </Text>
              ) : (
                <Button
                  $variant={page === currentPage ? 'primary' : 'ghost'}
                  $size="sm"
                  onClick={() => handlePageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          {/* Next button */}
          <Button
            $variant="ghost"
            $size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            →
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

TablePagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onItemsPerPageChange: PropTypes.func,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  showPageSizeSelector: PropTypes.bool,
  showItemCount: PropTypes.bool,
  containerProps: PropTypes.object,
};
