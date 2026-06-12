import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface PrimaryButtonProps {
  inverted?: boolean;
  children?: React.ReactNode;
  content?: React.ReactNode;
  fluid?: boolean;
  compact?: boolean;
  loading?: boolean;
  disabled?: boolean;
  as?: React.ElementType;
  [key: string]: any;
}

function PrimaryButton({
  inverted = false,
  children,
  content,
  fluid,
  compact,
  loading,
  disabled,
  as,
  ...other
}: PrimaryButtonProps) {
  const variant = inverted ? 'outlined' : 'contained';

  const buttonProps: Record<string, any> = {
    variant,
    fullWidth: fluid,
    size: compact ? 'small' : undefined,
    disabled: loading || disabled,
    disableElevation: true,
    sx: { textTransform: 'none' },
    startIcon: loading ? <CircularProgress size="1em" color="inherit" /> : undefined,
  };

  if (as) {
    buttonProps.component = as;
  }

  const button = (
    <Button {...buttonProps} {...other}>
      {children || content}
    </Button>
  );

  if (inverted) {
    return <div className="inverted-btn">{button}</div>;
  }

  return button;
}

export default PrimaryButton;
