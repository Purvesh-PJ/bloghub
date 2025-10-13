import React from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, FieldLabel, FieldError, Flex } from '../../ui/primitives';

/**
 * CheckboxField - A complete checkbox field with label and error handling
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.checked - Whether checkbox is checked
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Whether checkbox is disabled
 * @param {string} props.id - Checkbox ID for accessibility
 * @param {string} props.description - Optional description text
 * @param {Object} props.containerProps - Props for container Box
 */
export const CheckboxField = ({
  label,
  error,
  checked = false,
  onChange,
  disabled = false,
  id,
  description,
  containerProps = {},
  ...checkboxProps
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box {...containerProps}>
      <Flex $align="flex-start" $gap={3}>
        <Checkbox
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          {...checkboxProps}
        />
        <Box $flex="1">
          {label && (
            <FieldLabel
              htmlFor={checkboxId}
              style={{
                marginBottom: description ? '4px' : '0',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {label}
            </FieldLabel>
          )}
          {description && (
            <Box $fontSize="sm" $color="secondary" style={{ marginTop: '4px' }}>
              {description}
            </Box>
          )}
        </Box>
      </Flex>
      {error && (
        <FieldError id={`${checkboxId}-error`} role="alert" style={{ marginTop: '8px' }}>
          {error}
        </FieldError>
      )}
    </Box>
  );
};

CheckboxField.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  description: PropTypes.string,
  containerProps: PropTypes.object,
};
