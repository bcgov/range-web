import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Avatar } from './common';
import * as Routes from '../constants/routes';
import { LOGO_SRC } from '../constants/variables';
import { SSO_AUTH_LOGOUT_ENDPOINT } from '../constants/api';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export class Navbar extends Component {
  onLogoutBtnClick = () => {
    window.open(SSO_AUTH_LOGOUT_ENDPOINT, '_self');
  }

  render() {
    const { user } = this.props;

    return (
      <nav className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <img className="navbar__logo" src={LOGO_SRC} alt="Logo" />
            <Link to={Routes.RANGE_USE_PLANS}>
              <div className="navbar__title">My Range App</div>
            </Link>
          </div>

          <div className="navbar__right">
            <NavLink
              to={Routes.RANGE_USE_PLANS}
              className="navbar__link"
              activeClassName="navbar__link--active"
            >
              Select RUP
            </NavLink>

            <NavLink
              to={Routes.MANAGE_ZONE}
              className="navbar__link"
              activeClassName="navbar__link--active"
            >
              Manage Zone
            </NavLink>

            <div
              id="sign-out"
              className="navbar__link"
              role="button"
              tabIndex="0"
              onClick={this.onLogoutBtnClick}
            >
              Sign Out
            </div>

            <Avatar
              user={user}
            />
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = propTypes;
export default Navbar;
