import React from 'react';
import PropTypes from 'prop-types';
import { InvertedButton } from '../../common';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
};

const LeftBtn = ({ onClick, content }) => {
  return (
    <InvertedButton
      primaryColor
      className="rup__submission__tab__btn"
      onClick={onClick}
      content={content}
    />
  );
};

LeftBtn.propTypes = propTypes;
export default LeftBtn;
