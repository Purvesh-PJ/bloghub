import React, { memo, useEffect } from 'react';
import { useTable, useRowSelect, useSortBy, useFilters, usePagination, useGlobalFilter } from 'react-table';
import { 
  ParentContainer, 
  Table, 
  TableHeadContainer, 
  TableHead, 
  TableBody, 
  Row, 
  TableData, 
  TableFooter, 
  SelectedRecordsTypo,
  Wrapper,
  HeadWrapper,
  IconWrapper, 
  CelWrapper, 
  ArrowUpAndDownIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  PaginationContainer,
  PageButton,
  PageSizeSelector,
  PaginationText,
  CheckboxInput
} from './Table-Style';
import { TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight } from 'react-icons/tb';

// Custom pagination component
const TablePagination = ({ 
  gotoPage, 
  nextPage, 
  previousPage, 
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex, 
  pageSize, 
  setPageSize, 
  pageOptions 
}) => {
  return (
    <PaginationContainer>
      <PaginationText>
        Rows per page:
      </PaginationText>
      <PageSizeSelector
        value={pageSize}
        onChange={e => setPageSize(Number(e.target.value))}
      >
        {[5, 10, 20, 30, 50].map(size => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </PageSizeSelector>
      
      <PaginationText>
        {pageIndex + 1} of {pageOptions.length}
      </PaginationText>
      
      <PageButton 
        onClick={() => gotoPage(0)} 
        disabled={!canPreviousPage}
        title="First Page"
      >
        <TbChevronsLeft />
      </PageButton>
      
      <PageButton 
        onClick={() => previousPage()} 
        disabled={!canPreviousPage}
        title="Previous Page"
      >
        <TbChevronLeft />
      </PageButton>
      
      <PageButton 
        onClick={() => nextPage()} 
        disabled={!canNextPage}
        title="Next Page"
      >
        <TbChevronRight />
      </PageButton>
      
      <PageButton 
        onClick={() => gotoPage(pageCount - 1)} 
        disabled={!canNextPage}
        title="Last Page"
      >
        <TbChevronsRight />
      </PageButton>
    </PaginationContainer>
  );
};

// Custom checkbox component
const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <CheckboxInput ref={resolvedRef} {...rest} />
  );
});

const ReusableTable = memo(({ data, columns, onRowSelect }) => {
  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    prepareRow, 
    selectedFlatRows,
    page,
    pageOptions,
    state: { pageIndex, pageSize },
    gotoPage,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    setPageSize
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <Checkbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  // Pass selected rows to parent component
  useEffect(() => {
    if (onRowSelect) {
      onRowSelect(selectedFlatRows.map(row => row.original));
    }
  }, [selectedFlatRows, onRowSelect]);

  return (
    <ParentContainer>
      <Table {...getTableProps()}>
        <TableHeadContainer>
          {headerGroups.map(headerGroup => (
            <Row {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableHead {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Wrapper>
                    <HeadWrapper>
                      {column.render('Header')}
                    </HeadWrapper>
                    <IconWrapper>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <SortDescendingIcon />
                        ) : (
                          <SortAscendingIcon />
                        )
                      ) : column.canSort ? (
                        <ArrowUpAndDownIcon />
                      ) : null}
                    </IconWrapper>
                  </Wrapper> 
                </TableHead>
              ))}
            </Row>
          ))}
        </TableHeadContainer>

        <TableBody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <Row {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <TableData {...cell.getCellProps()}>
                    <CelWrapper>
                      {cell.render('Cell')}
                    </CelWrapper>
                  </TableData>
                ))}
              </Row>
            );
          })}
        </TableBody>

        <TableFooter>
          <Row className='footer-bottom-none'>
            <TableData colSpan={3}>
              <SelectedRecordsTypo>
                {selectedFlatRows.length > 0 ? `${selectedFlatRows.length} records selected` : ''}
              </SelectedRecordsTypo>
            </TableData>
            <TableData colSpan={columns.length}>
              <TablePagination 
                gotoPage={gotoPage} 
                nextPage={nextPage} 
                previousPage={previousPage} 
                canNextPage={canNextPage}
                canPreviousPage={canPreviousPage}
                pageCount={pageCount}
                pageIndex={pageIndex} 
                pageSize={pageSize} 
                setPageSize={setPageSize} 
                pageOptions={pageOptions} 
              />
            </TableData>
          </Row>
        </TableFooter>
      </Table>
    </ParentContainer>
  );
});

export default ReusableTable;
