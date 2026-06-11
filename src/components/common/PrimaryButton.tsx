import React from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';

interface PrimaryButtonProps extends ButtonProps {
  inverted?: boolean;
  children?: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ inverted = false, children, ...props }) => {
  if (inverted) {
    return (
      <div className="inverted-btn">
        <Button type="button" {...props}>
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
