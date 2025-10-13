import React from 'react';
import PropTypes from 'prop-types';
import { Box, FieldLabel, TextArea, FieldError } from '../../ui/primitives';

/**
 * TextareaField - A complete textarea field with label and error handling
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Textarea placeholder text
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Whether textarea is disabled
 * @param {number} props.rows - Number of visible text lines
 * @param {string} props.id - Textarea ID for accessibility
 * @param {Object} props.containerProps - Props for container Box
 */
export const TextareaField = ({
  label,
  error,
  required = false,
  placeholder,
  value,
  onChange,
  disabled = false,
  rows = 4,
  id,
  containerProps = {},
  ...textareaProps
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box {...containerProps}>
      {label && (
        <FieldLabel htmlFor={textareaId}>
          {label}
          {required && <span style={{ color: 'inherit', marginLeft: '4px' }}>*</span>}
        </FieldLabel>
      )}
      <TextArea
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...textareaProps}
      />
      {error && (
        <FieldError id={`${textareaId}-error`} role="alert">
          {error}
        </FieldError>
      )}
    </Box>
  );
};

TextareaField.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  id: PropTypes.string,
  containerProps: PropTypes.object,
};
