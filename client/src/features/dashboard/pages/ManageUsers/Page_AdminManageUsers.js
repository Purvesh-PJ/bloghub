import React, { useState, useMemo } from 'react';
import {
  Container,
  PageHeader,
  Title,
  HeaderActions,
  SearchContainer,
  SearchInput,
  IconButton,
  CardContainer,
  TableContainer,
  StatusBadge,
  UserInfoContainer,
  UserDetails,
  UserName,
  UserEmail,
  ActionButton,
  RoleBadge,
  TableRow,
} from './Page_AdminManageUsers.styles';
import { data as userData } from '../../../../data/UsersData';
import { useTable, useSortBy, useGlobalFilter, usePagination, useRowSelect } from 'react-table';
import {
  Search,
  UserPlus,
  Download,
  Upload,
  Filter,
  Edit,
  Trash2,
  UserCog,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const Page_AdminManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Define custom cell renderers
  const renderUserCell = ({ row }) => {
    const user = row.original;
    return (
      <UserInfoContainer>
        {user.profileImage}
        <UserDetails>
          <UserName>{user.userName}</UserName>
          <UserEmail>{user.userEmail}</UserEmail>
        </UserDetails>
      </UserInfoContainer>
    );
  };

  const renderStatusCell = ({ value }) => {
    const isActive = value === 'Active';
    return <StatusBadge className={isActive ? 'active' : 'inactive'}>{value}</StatusBadge>;
  };

  const renderRoleCell = ({ value }) => {
    const isAdmin = value === 'Administrator';
    return <RoleBadge className={isAdmin ? 'admin' : 'member'}>{value}</RoleBadge>;
  };

  const renderActionsCell = () => {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <ActionButton title="Edit User">
          <Edit size={16} />
        </ActionButton>
        <ActionButton title="Manage Permissions">
          <UserCog size={16} />
        </ActionButton>
        <ActionButton title="Delete User">
          <Trash2 size={16} />
        </ActionButton>
      </div>
    );
  };

  // Define columns
  const columns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'userName',
        Cell: renderUserCell,
      },
      {
        Header: 'Registration Date',
        accessor: 'registrationDate',
      },
      {
        Header: 'Role',
        accessor: 'userRole',
        Cell: renderRoleCell,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: renderStatusCell,
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: renderActionsCell,
      },
    ],
    [],
  );

  // Setup React Table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: userData,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setGlobalFilter(value || undefined);
  };

  return (
    <Container>
      <PageHeader>
        <Title>Manage Users</Title>
        <HeaderActions>
          <SearchContainer>
            <SearchInput
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <Search size={14} color="#6b7280" />
            </div>
          </SearchContainer>
          <IconButton title="Filter">
            <Filter size={14} strokeWidth={2.4} />
          </IconButton>
          <IconButton title="Export">
            <Download size={14} strokeWidth={2.4} />
          </IconButton>
          <IconButton title="Import">
            <Upload size={14} strokeWidth={2.4} />
          </IconButton>
          <IconButton className="primary" title="Add New User">
            <UserPlus size={14} strokeWidth={2.4} />
          </IconButton>
        </HeaderActions>
      </PageHeader>

      <CardContainer>
        <TableContainer>
          <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{
                        padding: '0.5rem',
                        textAlign: 'left',
                        borderBottom: '1px solid #e5e7eb',
                        color: '#4b5563',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: column.canSort ? 'pointer' : 'default',
                      }}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: '0.5rem',
                          borderBottom: '1px solid #e5e7eb',
                          color: '#374151',
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </TableContainer>

        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Showing {pageIndex * pageSize + 1} to{' '}
            {Math.min((pageIndex + 1) * pageSize, userData.length)} of {userData.length} users
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage} title="First Page">
              <ChevronsLeft size={16} />
            </IconButton>
            <IconButton
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </IconButton>
            <IconButton onClick={() => nextPage()} disabled={!canNextPage} title="Next Page">
              <ChevronRight size={16} />
            </IconButton>
            <IconButton
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              title="Last Page"
            >
              <ChevronsRight size={16} />
            </IconButton>
          </div>
        </div>
      </CardContainer>
    </Container>
  );
};

export default Page_AdminManageUsers;
