import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box } from '../../ui/primitives';

/**
 * GridSection - A responsive grid layout component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid content
 * @param {string} props.columns - Grid template columns
 * @param {string} props.columnsMd - Grid columns for medium screens
 * @param {string} props.columnsSm - Grid columns for small screens
 * @param {string} props.columnsXs - Grid columns for extra small screens
 * @param {number|string} props.gap - Gap between grid items
 * @param {string} props.alignItems - Align items in grid
 * @param {string} props.justifyItems - Justify items in grid
 * @param {number|string} props.padding - Grid padding
 * @param {Object} props.gridProps - Additional props for Grid component
 */
export const GridSection = ({
  children,
  columns = 'repeat(auto-fit, minmax(300px, 1fr))',
  columnsMd,
  columnsSm,
  columnsXs,
  gap = 6,
  alignItems = 'stretch',
  justifyItems = 'stretch',
  padding,
  gridProps = {},
  ...boxProps
}) => {
  return (
    <Box $p={padding} {...boxProps}>
      <Grid
        $cols={columns}
        $colsMd={columnsMd}
        $colsSm={columnsSm}
        $colsXs={columnsXs}
        $gap={gap}
        style={{
          alignItems,
          justifyItems,
        }}
        {...gridProps}
      >
        {children}
      </Grid>
    </Box>
  );
};

GridSection.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.string,
  columnsMd: PropTypes.string,
  columnsSm: PropTypes.string,
  columnsXs: PropTypes.string,
  gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  alignItems: PropTypes.string,
  justifyItems: PropTypes.string,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  gridProps: PropTypes.object,
};
