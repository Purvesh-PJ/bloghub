import React from 'react';
import { Select, FieldLabel } from '../../../components/ui/primitives';

const Dropdown = ({ label, value, onChange, options = [], ...props }) => {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Select value={value} onChange={onChange} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default Dropdown;
