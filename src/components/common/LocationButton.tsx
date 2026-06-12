import React, { useState } from 'react';
import Button from '@mui/material/Button';

interface LocationButtonProps {
  children?: React.ReactNode;
  onLocation: (position: GeolocationPosition) => void;
  [key: string]: any;
}

function LocationButton({ children, onLocation, ...props }: LocationButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      fullWidth
      type="button"
      {...props}
      disabled={loading}
      onClick={() => {
        if ('geolocation' in navigator) {
          setLoading(true);
          navigator.geolocation.getCurrentPosition((...args) => {
            setLoading(false);
            onLocation(...args);
          });
        }
      }}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
}

export default LocationButton;
