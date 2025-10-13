import React from 'react';
import PropTypes from 'prop-types';
import { Box, Switch, FieldLabel, FieldError, Flex } from '../../ui/primitives';

/**
 * SwitchToggle - A complete switch toggle with label and error handling
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.checked - Whether switch is checked
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Whether switch is disabled
 * @param {string} props.id - Switch ID for accessibility
 * @param {string} props.description - Optional description text
 * @param {string} props.size - Switch size ('sm', 'md', 'lg')
 * @param {Object} props.containerProps - Props for container Box
 */
export const SwitchToggle = ({
  label,
  error,
  checked = false,
  onChange,
  disabled = false,
  id,
  description,
  size = 'md',
  containerProps = {},
  ...switchProps
}) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box {...containerProps}>
      <Flex $align="flex-start" $justify="space-between" $gap={4}>
        <Box $flex="1">
          {label && (
            <FieldLabel
              htmlFor={switchId}
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

        <Switch
          id={switchId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          $size={size}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${switchId}-error` : undefined}
          {...switchProps}
        />
      </Flex>

      {error && (
        <FieldError id={`${switchId}-error`} role="alert" style={{ marginTop: '8px' }}>
          {error}
        </FieldError>
      )}
    </Box>
  );
};

SwitchToggle.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  description: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  containerProps: PropTypes.object,
};
