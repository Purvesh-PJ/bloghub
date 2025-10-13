import React from 'react';
import PropTypes from 'prop-types';
import { Box, FieldLabel, Input, FieldError } from '../../ui/primitives';

/**
 * InputField - A complete input field with label and error handling
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {string} props.id - Input ID for accessibility
 * @param {Object} props.containerProps - Props for container Box
 */
export const InputField = ({
  label,
  error,
  required = false,
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  id,
  containerProps = {},
  ...inputProps
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

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
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
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

InputField.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  containerProps: PropTypes.object,
};
