import React from 'react';
import PropTypes from 'prop-types';
import {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '../../ui/primitives';

/**
 * BreadcrumbNavigation - A breadcrumb navigation component
 *
 * @param {Object} props
 * @param {Array} props.items - Array of breadcrumb items {label, href, onClick, active}
 * @param {string} props.separator - Separator character or component
 * @param {number} props.maxItems - Maximum number of items to show
 * @param {Object} props.breadcrumbProps - Additional props for breadcrumb container
 */
export const BreadcrumbNavigation = ({
  items = [],
  separator = '/',
  maxItems,
  breadcrumbProps = {},
}) => {
  // Handle max items by showing first, ellipsis, and last items
  const displayItems =
    maxItems && items.length > maxItems
      ? [...items.slice(0, 1), { label: '...', isEllipsis: true }, ...items.slice(-(maxItems - 2))]
      : items;

  return (
    <Breadcrumbs role="navigation" aria-label="Breadcrumb navigation" {...breadcrumbProps}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.isEllipsis;

        return (
          <React.Fragment key={item.href || item.label || index}>
            <BreadcrumbItem>
              {isEllipsis ? (
                <span aria-hidden="true">{item.label}</span>
              ) : isLast || !item.href ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <BreadcrumbLink
                  as={item.onClick ? 'button' : 'a'}
                  href={item.href}
                  onClick={item.onClick}
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {!isLast && <BreadcrumbSeparator aria-hidden="true">{separator}</BreadcrumbSeparator>}
          </React.Fragment>
        );
      })}
    </Breadcrumbs>
  );
};

BreadcrumbNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
      active: PropTypes.bool,
    }),
  ),
  separator: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  maxItems: PropTypes.number,
  breadcrumbProps: PropTypes.object,
};
