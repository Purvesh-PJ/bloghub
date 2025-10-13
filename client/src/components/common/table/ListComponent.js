import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Text, Divider } from '../../ui/primitives';
import styled from 'styled-components';

const ListContainer = styled(Box)`
  border: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  border-radius: ${(p) => p.theme.radii.lg};
  background: ${(p) => p.theme.palette.background.surface};
  overflow: hidden;
`;

const ListItem = styled(Flex)`
  padding: ${(p) => p.theme.spacing(4)};
  transition: background ${(p) => p.theme.motion.duration.fast}
    ${(p) => p.theme.motion.easing.standard};
  cursor: ${(p) => (p.$interactive ? 'pointer' : 'default')};

  &:hover {
    background: ${(p) => (p.$interactive ? p.theme.palette.background.subtle : 'transparent')};
  }

  &:not(:last-child) {
    border-bottom: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  }
`;

const ItemContent = styled(Box)`
  flex: 1;
  min-width: 0; /* Allows text truncation */
`;

const ItemActions = styled(Flex)`
  flex-shrink: 0;
  gap: ${(p) => p.theme.spacing(2)};
`;

/**
 * ListComponent - A flexible list component for displaying data
 *
 * @param {Object} props
 * @param {Array} props.items - Array of items to display
 * @param {Function} props.renderItem - Function to render each item (item, index) => ReactNode
 * @param {Function} props.onItemClick - Item click handler
 * @param {React.ReactNode} props.emptyState - Content to show when no items
 * @param {boolean} props.divided - Whether to show dividers between items
 * @param {string} props.spacing - Spacing between items ('sm', 'md', 'lg')
 * @param {Object} props.listProps - Additional props for list container
 */
export const ListComponent = ({
  items = [],
  renderItem,
  onItemClick,
  emptyState = 'No items to display',
  divided = true,
  spacing = 'md',
  listProps = {},
}) => {
  const spacingMap = {
    sm: 3,
    md: 4,
    lg: 6,
  };

  const itemPadding = spacingMap[spacing] || spacingMap.md;

  const handleItemClick = (item, index) => {
    onItemClick?.(item, index);
  };

  if (items.length === 0) {
    return (
      <ListContainer {...listProps}>
        <Box $p={12} $textAlign="center">
          <Text $color="muted">{emptyState}</Text>
        </Box>
      </ListContainer>
    );
  }

  return (
    <ListContainer {...listProps}>
      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          <ListItem
            $interactive={!!onItemClick}
            onClick={() => handleItemClick(item, index)}
            style={{ padding: `${itemPadding * 4}px` }}
          >
            {renderItem ? (
              renderItem(item, index)
            ) : (
              <ItemContent>
                <Text>{item.title || item.name || item.label || String(item)}</Text>
                {item.description && (
                  <Text $fontSize="sm" $color="secondary" style={{ marginTop: '4px' }}>
                    {item.description}
                  </Text>
                )}
              </ItemContent>
            )}
          </ListItem>
          {divided && index < items.length - 1 && <Divider $my={0} />}
        </React.Fragment>
      ))}
    </ListContainer>
  );
};

/**
 * ListItem - Individual list item component for custom layouts
 */
export const ListItemComponent = ({
  children,
  onClick,
  interactive = false,
  actions,
  ...itemProps
}) => {
  return (
    <ListItem $interactive={interactive || !!onClick} onClick={onClick} {...itemProps}>
      <ItemContent>{children}</ItemContent>
      {actions && <ItemActions>{actions}</ItemActions>}
    </ListItem>
  );
};

ListComponent.propTypes = {
  items: PropTypes.array,
  renderItem: PropTypes.func,
  onItemClick: PropTypes.func,
  emptyState: PropTypes.node,
  divided: PropTypes.bool,
  spacing: PropTypes.oneOf(['sm', 'md', 'lg']),
  listProps: PropTypes.object,
};

ListItemComponent.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  interactive: PropTypes.bool,
  actions: PropTypes.node,
};
