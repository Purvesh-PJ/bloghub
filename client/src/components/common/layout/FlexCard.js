import React from 'react';
import PropTypes from 'prop-types';
import { Card, Flex, Box } from '../../ui/primitives';

/**
 * FlexCard - A flexible card component with customizable layout
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.direction - Flex direction ('row', 'column')
 * @param {string} props.align - Align items ('flex-start', 'center', 'flex-end', 'stretch')
 * @param {string} props.justify - Justify content ('flex-start', 'center', 'flex-end', 'space-between', 'space-around')
 * @param {number|string} props.gap - Gap between items
 * @param {boolean} props.wrap - Whether to wrap items
 * @param {boolean} props.interactive - Whether card is interactive (hover effects)
 * @param {boolean} props.elevated - Whether card has elevated shadow
 * @param {number|string} props.padding - Card padding
 * @param {Function} props.onClick - Click handler for interactive cards
 * @param {Object} props.cardProps - Additional props for Card component
 */
export const FlexCard = ({
  children,
  direction = 'column',
  align = 'stretch',
  justify = 'flex-start',
  gap = 4,
  wrap = false,
  interactive = false,
  elevated = false,
  padding,
  onClick,
  cardProps = {},
  ...flexProps
}) => {
  return (
    <Card
      $interactive={interactive}
      $elevated={elevated}
      $p={padding}
      onClick={onClick}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...cardProps}
    >
      <Flex
        $direction={direction}
        $align={align}
        $justify={justify}
        $gap={gap}
        $wrap={wrap}
        {...flexProps}
      >
        {children}
      </Flex>
    </Card>
  );
};

FlexCard.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.oneOf(['row', 'column', 'row-reverse', 'column-reverse']),
  align: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
  justify: PropTypes.oneOf([
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  wrap: PropTypes.bool,
  interactive: PropTypes.bool,
  elevated: PropTypes.bool,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  cardProps: PropTypes.object,
};
