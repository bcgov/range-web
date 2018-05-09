import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getReferences, getZones } from '../actions/commonActions';
import Navbar from './Navbar';

const propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
};

export class LandingPage extends Component {
  componentWillMount() {
    const { getReferences, getZones } = this.props;
    getReferences();
    getZones();
  }

  render() {
    const { component: Component, ...rest } = this.props;

    return (
      <div className="main">
        <Navbar {...rest} />
        <Component {...rest} />
        <footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.auth;

  return {
    user,
  };
};

LandingPage.propTypes = propTypes;
export default connect(mapStateToProps, { getReferences, getZones })(LandingPage);
