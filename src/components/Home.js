import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Agreement from './agreement';

/* eslint-disable react/prefer-stateless-function */
const propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};

class Home extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <Agreement {...this.props} />
    );
  }
}

Home.propTypes = propTypes;
export default withRouter(Home);
