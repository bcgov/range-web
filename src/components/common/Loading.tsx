import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const sizeMap: Record<string, number> = {
  mini: 16,
  tiny: 20,
  small: 24,
  medium: 32,
  large: 40,
  big: 48,
  huge: 64,
  massive: 80,
};

interface LoadingProps {
  inverted?: boolean;
  active?: boolean;
  message?: string;
  onlySpinner?: boolean;
  size?: string;
  containerProps?: Record<string, any>;
}

function Loading({
  size = 'large',
  active = true,
  inverted = true,
  message = '',
  onlySpinner = false,
  containerProps,
}: LoadingProps) {
  const pxSize = sizeMap[size] || 40;

  if (onlySpinner) {
    if (!active) return null;

    return (
      <div className="loading-spinner__container" {...containerProps}>
        <CircularProgress size={pxSize} />
      </div>
    );
  }

  return (
    <Backdrop
      open={active}
      sx={(theme) => ({
        color: inverted ? '#000' : '#fff',
        backgroundColor: inverted ? 'rgba(255,255,255,0.8)' : undefined,
        zIndex: theme.zIndex.drawer + 1,
        position: containerProps?.page ? 'absolute' : 'fixed',
        flexDirection: 'column',
        gap: 2,
      })}
      {...containerProps}
    >
      <CircularProgress size={pxSize} color="inherit" />
      {message && <span style={{ marginTop: 8 }}>{message}</span>}
    </Backdrop>
  );
}

export default Loading;
