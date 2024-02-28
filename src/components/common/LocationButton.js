import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

const LocationButton = ({ children, onLocation, ...props }) => {
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

LocationButton.propTypes = {
  children: PropTypes.any,
  onLocation: PropTypes.func.isRequired,
};

export default LocationButton;
