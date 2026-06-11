import React from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';

interface PrimaryButtonProps extends ButtonProps {
  inverted?: boolean;
  children?: React.ReactNode;
}

function PrimaryButton({ inverted = false, children, ...props }: PrimaryButtonProps) {
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
}

export default PrimaryButton;
