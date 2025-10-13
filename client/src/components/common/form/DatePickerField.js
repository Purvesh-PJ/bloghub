import React from 'react';
import PropTypes from 'prop-types';
import { Box, FieldLabel, Input, FieldError } from '../../ui/primitives';

/**
 * DatePickerField - A complete date picker field with label and error handling
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.value - Date value (YYYY-MM-DD format)
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {string} props.min - Minimum date (YYYY-MM-DD format)
 * @param {string} props.max - Maximum date (YYYY-MM-DD format)
 * @param {string} props.id - Input ID for accessibility
 * @param {string} props.type - Date input type ('date', 'datetime-local', 'time')
 * @param {Object} props.containerProps - Props for container Box
 */
export const DatePickerField = ({
  label,
  error,
  required = false,
  value,
  onChange,
  disabled = false,
  min,
  max,
  id,
  type = 'date',
  containerProps = {},
  ...inputProps
}) => {
  const inputId = id || `date-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (event) => {
    onChange?.(event.target.value);
  };

  return (
    <Box {...containerProps}>
      {label && (
        <FieldLabel htmlFor={inputId}>
          {label}
          {required && <span style={{ color: 'inherit', marginLeft: '4px' }}>*</span>}
        </FieldLabel>
      )}
      <Input
        id={inputId}
        type={type}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        min={min}
        max={max}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...inputProps}
      />
      {error && (
        <FieldError id={`${inputId}-error`} role="alert">
          {error}
        </FieldError>
      )}
    </Box>
  );
};

DatePickerField.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.oneOf(['date', 'datetime-local', 'time']),
  containerProps: PropTypes.object,
};
