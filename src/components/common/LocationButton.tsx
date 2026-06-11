import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';

interface LocationButtonProps {
  children?: React.ReactNode;
  onLocation: (position: GeolocationPosition) => void;
  [key: string]: any;
}

const LocationButton: React.FC<LocationButtonProps> = ({ children, onLocation, ...props }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Form.Button
      fluid
      type="button"
      {...props}
      loading={loading}
      onClick={() => {
        if ('geolocation' in navigator) {
          setLoading(true);
          navigator.geolocation.getCurrentPosition((...args) => {
            setLoading(false);
            onLocation(...args);
          });
        }
      }}
      label="&nbsp;"
    >
      {children}
    </Form.Button>
  );
};

export default LocationButton;
