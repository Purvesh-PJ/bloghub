import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, FieldLabel, FieldError, Button, Flex, Badge } from '../../ui/primitives';
import styled from 'styled-components';

const DropdownContainer = styled(Box)`
  position: relative;
`;

const DropdownButton = styled(Button)`
  width: 100%;
  justify-content: space-between;
  text-align: left;
  background: ${(p) => p.theme.palette.background.surface};
  color: ${(p) => p.theme.palette.text.primary};
  border: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};

  &:hover {
    background: ${(p) => p.theme.palette.background.surface};
    border-color: ${(p) => p.theme.palette.grey[400]};
  }
`;

const DropdownList = styled(Box)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  background: ${(p) => p.theme.palette.background.surface};
  border: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  border-radius: ${(p) => p.theme.radii.lg};
  box-shadow: ${(p) => p.theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
  margin-top: ${(p) => p.theme.spacing(1)};
`;

const DropdownItem = styled(Box)`
  padding: ${(p) => p.theme.spacing(2)} ${(p) => p.theme.spacing(3)};
  cursor: pointer;
  transition: background ${(p) => p.theme.motion.duration.fast}
    ${(p) => p.theme.motion.easing.standard};

  &:hover {
    background: ${(p) => p.theme.palette.background.subtle};
  }

  &:first-child {
    border-top-left-radius: ${(p) => p.theme.radii.lg};
    border-top-right-radius: ${(p) => p.theme.radii.lg};
  }

  &:last-child {
    border-bottom-left-radius: ${(p) => p.theme.radii.lg};
    border-bottom-right-radius: ${(p) => p.theme.radii.lg};
  }
`;

/**
 * MultiSelectDropdown - A multi-select dropdown with label and error handling
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Placeholder text when no items selected
 * @param {Array} props.options - Array of option objects {value, label}
 * @param {Array} props.value - Array of selected values
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Whether select is disabled
 * @param {string} props.id - Select ID for accessibility
 * @param {Object} props.containerProps - Props for container Box
 */
export const MultiSelectDropdown = ({
  label,
  error,
  required = false,
  placeholder = 'Select options...',
  options = [],
  value = [],
  onChange,
  disabled = false,
  id,
  containerProps = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectId = id || `multiselect-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const handleRemoveOption = (optionValue, event) => {
    event.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
    onChange?.(newValue);
  };

  const selectedOptions = options.filter((option) => value.includes(option.value));
  const displayText =
    selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder;

  return (
    <Box {...containerProps}>
      {label && (
        <FieldLabel htmlFor={selectId}>
          {label}
          {required && <span style={{ color: 'inherit', marginLeft: '4px' }}>*</span>}
        </FieldLabel>
      )}

      <DropdownContainer ref={dropdownRef}>
        <DropdownButton
          id={selectId}
          $variant="ghost"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
        >
          <span>{displayText}</span>
          <span
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            ▼
          </span>
        </DropdownButton>

        {isOpen && (
          <DropdownList role="listbox" aria-multiselectable="true">
            {options.map((option) => (
              <DropdownItem
                key={option.value}
                role="option"
                aria-selected={value.includes(option.value)}
                onClick={() => handleToggleOption(option.value)}
              >
                <Flex $align="center" $justify="space-between">
                  <span>{option.label}</span>
                  {value.includes(option.value) && <span>✓</span>}
                </Flex>
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </DropdownContainer>

      {selectedOptions.length > 0 && (
        <Flex $gap={2} $wrap style={{ marginTop: '8px' }}>
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              $interactive
              onClick={(e) => handleRemoveOption(option.value, e)}
              style={{ cursor: 'pointer' }}
            >
              {option.label} ×
            </Badge>
          ))}
        </Flex>
      )}

      {error && (
        <FieldError id={`${selectId}-error`} role="alert">
          {error}
        </FieldError>
      )}
    </Box>
  );
};

MultiSelectDropdown.propTypes = {
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
  value: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  containerProps: PropTypes.object,
};
