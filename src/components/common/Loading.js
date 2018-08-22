import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Dimmer } from 'semantic-ui-react';

const propTypes = {
  inverted: PropTypes.bool,
  active: PropTypes.bool,
  message: PropTypes.string,
};

const defaultProps = {
  inverted: true,
  active: true,
  message: '',
};

const Loading = ({ active, inverted, message }) => (
  <Dimmer
    active={active}
    inverted={inverted}
  >
    <Loader size="large">{message}</Loader>
  </Dimmer>
);

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;
export default Loading;
