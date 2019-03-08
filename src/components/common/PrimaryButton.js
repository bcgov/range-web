import React from 'react';
import { Button } from 'semantic-ui-react';

const PrimaryButton = ({
  inverted = false,
  children,
  ...props
}) => {
  if (inverted) {
    return (
      <div className="inverted-btn">
        <Button {...props}>
          {children}
        </Button>
      </div>
    );
  }

  return (
    <Button primary {...props}>
      {children}
    </Button>
  );
};

export default PrimaryButton;
