import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Avatar } from './common';
import * as Routes from '../constants/routes';
import { LOGO_SRC } from '../constants/variables';
import { logout } from '../actions/authActions';

const propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
}

export class LandingPage extends Component {
  onLogout = () => {
    this.props.logout();
  }

  render() {
    const { component: Component, user, ...rest } = this.props;

    return (
      <div className="main">
        <nav className="navbar">
          <div className="navbar__container container">
            <div className="navbar__left">
              <img className="navbar__logo" src={LOGO_SRC} alt="Logo"/>
              <div className="navbar__title">My Range App</div>
            </div>
            <div className="navbar__right">
              <NavLink 
                to={Routes.RANGE_USE_PLANS}
                className="navbar__link"
                activeClassName="navbar__link--active"
              >
                Range Use Plans
              </NavLink>
              <NavLink
                to={Routes.MANAGE_ZONE}
                className="navbar__link"
                activeClassName="navbar__link--active"
              >
                Manage Zone
              </NavLink>
              <NavLink
                id="sign-out"
                to={Routes.LOGIN}
                className="navbar__link"
                onClick={this.onLogout}
              >
                Sign Out
              </NavLink>
              <Avatar 
                name="KH" 
              />
            </div>
          </div>
        </nav>

        <Component {...rest} />
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
  mapStateToProps, { logout }
)(LandingPage)