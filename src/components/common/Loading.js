import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Dimmer } from 'semantic-ui-react';

const propTypes = {
  inverted: PropTypes.bool,
  active: PropTypes.bool,
  message: PropTypes.string,
  onlySpinner: PropTypes.bool,
  size: PropTypes.string,
};

const defaultProps = {
  inverted: true,
  active: true,
  message: '',
  onlySpinner: false,
  size: 'large',
};

const Loading = ({ size, active, inverted, message, onlySpinner }) => {
  if (onlySpinner) {
    return (
      <div className="loading-spinner__container">
        <Loader active={active} size={size} content={message} />
      </div>
    );
  }

  return (
    <Dimmer
      active={active}
      inverted={inverted}
    >
      <Loader size={size} content={message} />
    </Dimmer>
  );
};

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;
export default Loading;
