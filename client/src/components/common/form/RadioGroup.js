import React from 'react';
import PropTypes from 'prop-types';
import { Box, Radio, FieldLabel, FieldError, Stack, Flex } from '../../ui/primitives';

/**
 * RadioGroup - A group of radio buttons with label and error handling
 *
 * @param {Object} props
 * @param {string} props.label - Group label text
 * @param {string} props.error - Error message to display
 * @param {Array} props.options - Array of option objects {value, label, description}
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Whether all radios are disabled
 * @param {string} props.name - Radio group name for accessibility
 * @param {string} props.direction - Layout direction ('column' or 'row')
 * @param {Object} props.containerProps - Props for container Box
 */
export const RadioGroup = ({
  label,
  error,
  options = [],
  value,
  onChange,
  disabled = false,
  name,
  direction = 'column',
  containerProps = {},
}) => {
  const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  const groupId = `${groupName}-group`;

  const handleChange = (optionValue) => {
    onChange?.(optionValue);
  };

  const LayoutComponent = direction === 'row' ? Flex : Stack;
  const layoutProps = direction === 'row' ? { $gap: 6, $wrap: true } : { $gap: 3 };

  return (
    <Box
      role="radiogroup"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${groupId}-error` : undefined}
      {...containerProps}
    >
      {label && (
        <FieldLabel id={`${groupId}-label`} style={{ marginBottom: '12px' }}>
          {label}
        </FieldLabel>
      )}

      <LayoutComponent {...layoutProps}>
        {options.map((option) => {
          const radioId = `${groupName}-${option.value}`;
          const isChecked = value === option.value;

          return (
            <Flex key={option.value} $align="flex-start" $gap={3}>
              <Radio
                id={radioId}
                name={groupName}
                value={option.value}
                checked={isChecked}
                onChange={() => handleChange(option.value)}
                disabled={disabled}
              />
              <Box $flex="1">
                <FieldLabel
                  htmlFor={radioId}
                  style={{
                    marginBottom: option.description ? '4px' : '0',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {option.label}
                </FieldLabel>
                {option.description && (
                  <Box $fontSize="sm" $color="secondary" style={{ marginTop: '4px' }}>
                    {option.description}
                  </Box>
                )}
              </Box>
            </Flex>
          );
        })}
      </LayoutComponent>

      {error && (
        <FieldError id={`${groupId}-error`} role="alert" style={{ marginTop: '12px' }}>
          {error}
        </FieldError>
      )}
    </Box>
  );
};

RadioGroup.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  direction: PropTypes.oneOf(['column', 'row']),
  containerProps: PropTypes.object,
};
