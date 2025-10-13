import React from 'react';
import { Button } from '../../../components/ui/primitives';

const MultiUseButton = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  size = 'md',
  ...props
}) => {
  return (
    <Button
      $variant={variant}
      $size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MultiUseButton;
