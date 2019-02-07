import React from 'react';
import { Button } from 'semantic-ui-react';

const InvertedButton = ({
  primaryColor = false,
  children,
  ...props
}) => {
  if (primaryColor) {
    return (
      <div className="inverted-btn">
        <Button
          {...props}
        >
          {children}
        </Button>
      </div>
    );
  }

  return (
    <Button
      inverted
      {...props}
    >
      {children}
    </Button>
  );
};

export default InvertedButton;
