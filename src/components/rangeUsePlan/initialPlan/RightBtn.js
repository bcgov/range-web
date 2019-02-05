import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  content: PropTypes.string.isRequired,
};

const defaultProps = {
  disabled: false,
};

const RightBtn = ({ onClick, disabled, content }) => {
  return (
    <Button
      className="rup__submission__tab__btn"
      primary
      onClick={onClick}
      disabled={disabled}
      content={content}
      style={{ margin: '0' }}
    />
  );
};

RightBtn.propTypes = propTypes;
RightBtn.defaultProps = defaultProps;
export default RightBtn;
