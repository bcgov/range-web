import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Avatar } from './common';
import * as Routes from '../constants/routes';
import { LOGO_SRC } from '../constants/variables';

const propTypes = {
  onLogout: PropTypes.func.isRequired,
};

class Navbar extends Component {
  render() {
    const { onLogout } = this.props;

    return (
      <nav className="navbar">
        <div className="navbar__container container">
          <div className="navbar__left">
            <img className="navbar__logo" src={LOGO_SRC} alt="Logo"/>
            <Link to={Routes.RANGE_USE_PLANS}><div className="navbar__title">My Range App</div></Link>
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
              onClick={onLogout}
            >
              Sign Out
            </NavLink>
            <Avatar 
              name="KH" 
            />
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = propTypes;
export default Navbar;