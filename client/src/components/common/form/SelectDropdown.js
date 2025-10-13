import React from 'react';
import PropTypes from 'prop-types';
import { Box, FieldLabel, Select, FieldError } from '../../ui/primitives';

/**
 * SelectDropdown - A complete select dropdown with label and error handling
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Placeholder option text
 * @param {Array} props.options - Array of option objects {value, label}
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Whether select is disabled
 * @param {string} props.id - Select ID for accessibility
 * @param {Object} props.containerProps - Props for container Box
 */
export const SelectDropdown = ({
  label,
  error,
  required = false,
  placeholder = 'Select an option...',
  options = [],
  value,
  onChange,
  disabled = false,
  id,
  containerProps = {},
  ...selectProps
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box {...containerProps}>
      {label && (
        <FieldLabel htmlFor={selectId}>
          {label}
          {required && <span style={{ color: 'inherit', marginLeft: '4px' }}>*</span>}
        </FieldLabel>
      )}
      <Select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && (
        <FieldError id={`${selectId}-error`} role="alert">
          {error}
        </FieldError>
      )}
    </Box>
  );
};

SelectDropdown.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  containerProps: PropTypes.object,
};
