// @ts-nocheck
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

const Loading = ({
  size = 'large',
  active = true,
  inverted = true,
  message = '',
  onlySpinner = false,
  containerProps,
}) => {
  if (onlySpinner) {
    return (
      <div className="loading-spinner__container" {...containerProps}>
        <Loader active={active} size={size} content={message} />
      </div>
    );
  }

  return (
    <Dimmer active={active} inverted={inverted} {...containerProps}>
      <Loader size={size} content={message} />
    </Dimmer>
  );
};

Loading.propTypes = propTypes;
export default Loading;
