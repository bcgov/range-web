import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
};

const RightBtn = ({ onClick, disabled, content }) => {
  return (
    <Button
      className="multi-form__btn"
      primary
      onClick={onClick}
      disabled={disabled}
      content={content}
    />
  );
};

RightBtn.propTypes = propTypes;
export default RightBtn;
