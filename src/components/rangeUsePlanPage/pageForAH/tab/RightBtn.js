import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton } from '../../../common';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  content: PropTypes.string.isRequired,
};

const defaultProps = {
  disabled: false,
  loading: false,
};

const RightBtn = ({ onClick, disabled, content, loading }) => {
  return (
    <PrimaryButton
      className="rup__multi-tab__tab__btn"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      content={content}
      style={{ margin: '0' }}
    />
  );
};

RightBtn.propTypes = propTypes;
RightBtn.defaultProps = defaultProps;
export default RightBtn;
