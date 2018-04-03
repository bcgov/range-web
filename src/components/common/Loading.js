import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Dimmer } from 'semantic-ui-react';

const propTypes = {
  inverted: PropTypes.bool,
  active: PropTypes.bool,
};

const defaultProps = {
  inverted: true,
  active: true,
};

const Loading = ({ active, inverted }) => (
  <Dimmer
    active={active}
    inverted={inverted}
  >
    <Loader size="large" />
  </Dimmer>
);

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;
export default Loading;
