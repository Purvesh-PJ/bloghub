import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard utility function for combining Tailwind classes and conditional classes.
 * Used across all shadcn/ui components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
