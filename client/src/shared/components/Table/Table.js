import React from 'react';
import styled from 'styled-components';
import { Card } from '../../../components/ui/primitives';

const TableContainer = styled(Card)`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${(p) => p.theme.palette.background.subtle};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${(p) => p.theme.palette.divider};

  &:hover {
    background: ${(p) => p.theme.palette.background.subtle};
  }
`;

const TableHeader = styled.th`
  padding: ${(p) => p.theme.spacing(3)};
  text-align: left;
  font-weight: 600;
  color: ${(p) => p.theme.palette.text.primary};
`;

const TableCell = styled.td`
  padding: ${(p) => p.theme.spacing(3)};
  color: ${(p) => p.theme.palette.text.primary};
`;

const Table = ({ columns = [], data = [], ...props }) => {
  return (
    <TableContainer>
      <StyledTable {...props}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableHeader key={index}>{column.header || column.label}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <tbody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.accessor ? row[column.accessor] : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default Table;
