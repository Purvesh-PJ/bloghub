import React from 'react';
import { Checkbox as PrimitiveCheckbox } from '../../../components/ui/primitives';

export const Checkbox = ({ checked, onChange, indeterminate = false, ...props }) => {
  return <PrimitiveCheckbox checked={checked} onChange={onChange} {...props} />;
};
