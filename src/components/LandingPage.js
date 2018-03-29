import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../actions/authActions';
import { getReferences } from '../actions/commonActions';
import { getZones } from '../actions/rangeUsePlanActions';
import Navbar from './Navbar';

const propTypes = {
  component: PropTypes.func.isRequired,
};

export class LandingPage extends Component {
  componentWillMount() {
    const { getReferences, getZones } = this.props;
    getReferences();
    getZones();
  }
  
  onLogout = () => {
    this.props.logout();
  }

  render() {
    const { component: Component, user, ...rest } = this.props;

    return (
      <div className="main">
        <Navbar onLogout={this.onLogout}/>
        <Component {...rest} />
        <footer></footer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.auth;
  
  return {
    user
  };  
};

LandingPage.propTypes = propTypes;
export default connect (
  mapStateToProps, { logout, getReferences, getZones }
)(LandingPage)