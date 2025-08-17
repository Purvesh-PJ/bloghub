import React, { useState, useEffect, useRef } from 'react';
import { Container, SelectedValueContainer , UnorderedList, ListItem, DropIcon, SelectedText } from './Dropdown-Style'; 
import PropTypes from 'prop-types';

const Dropdown = ({ options, onChange, style, className, defaultValue }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');
  const dropdownRef = useRef(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  },[]);

  // Handle option select
  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) onChange(value);
  };

  // Handle key events for accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && isOpen) {
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.dataset.value) {
        handleSelect(focusedElement.dataset.value);
      }
    }
  };

  return (

      <Container
        ref={dropdownRef}
        className={`dropdown ${className || ''}`}
        style={style}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
       >
        <SelectedValueContainer className="dropdown-selected" aria-label="Selected value">
          <SelectedText>
            {selectedValue || 'Select an option'}
          </SelectedText> 
          <DropIcon />
        </SelectedValueContainer>
        {
            isOpen && (
              <UnorderedList className="dropdown-menu" role="listbox">
                {options.map((option) => (
                  <ListItem 
                    key={option.value}
                    data-value={option.value}
                    className="dropdown-item"
                    role="option"
                    tabIndex={0}
                    onClick={() => handleSelect(option.value)}
                    aria-selected={selectedValue === option.value}
                  >
                    {option.label}
                  </ListItem >
                ))}
              </UnorderedList>
            )
        }
      </Container>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
};

export default Dropdown;
