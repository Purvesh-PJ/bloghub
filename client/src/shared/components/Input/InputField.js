import React from 'react';
import { Input, FieldLabel, FieldError } from '../../../components/ui/primitives';

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  error = false,
  helperText,
  ...props
}) => {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Input value={value} onChange={onChange} type={type} {...props} />
      {error && helperText && <FieldError>{helperText}</FieldError>}
    </div>
  );
};

export default InputField;
