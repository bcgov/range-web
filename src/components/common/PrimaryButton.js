import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const propTypes = {
  onClick: PropTypes.func.isRequired,
};

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

PrimaryButton.propTypes = propTypes;
export default PrimaryButton;
