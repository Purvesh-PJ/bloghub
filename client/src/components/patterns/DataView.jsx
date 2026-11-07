import React from 'react';
import { EmptyState, ErrorState, TableSkeleton } from '../ui';

/**
 * DataView — Composed pattern encapsulating the async data lifecycle:
 * Loading (skeleton) -> Error (retryable ErrorState) -> Empty (EmptyState) -> Content.
 */
export function DataView({
  isLoading = false,
  skeleton,
  isError = false,
  error,
  errorTitle = 'Unable to load data',
  onRetry,
  isEmpty = false,
  emptyIcon,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyAction,
  children,
}) {
  if (isError) {
    return <ErrorState title={errorTitle} error={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return skeleton || <TableSkeleton rows={5} />;
  }

  if (isEmpty) {
    return (
      <EmptyState icon={emptyIcon} title={emptyTitle} actions={emptyAction}>
        {emptyDescription}
      </EmptyState>
    );
  }

  return children;
}
