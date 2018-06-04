import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Avatar } from './common';
import * as Routes from '../constants/routes';
import { LOGO_SRC, SIGN_OUT_ELEMENT_ID } from '../constants/variables';
import { SITEMINDER_LOGOUT_ENDPOINT } from '../constants/api';
import { logout } from '../actions/authActions';
import { User } from '../models';

const propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
};

export class Navbar extends Component {
  onLogoutBtnClick = () => {
    // clear the local storage in the browser
    this.props.logout();

    // open a new tab for signing out from SiteMinder which is Gov's auth platform
    // once it returns back, it will sign out from SSO which will happen in Logout.js
    window.open(SITEMINDER_LOGOUT_ENDPOINT, 'blank');
  }

  render() {
    const { user: u } = this.props;
    const user = new User(u);

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

            {user.isAdmin &&
              <NavLink
                to={Routes.MANAGE_ZONE}
                className="navbar__link"
                activeClassName="navbar__link--active"
              >
                Manage Zone
              </NavLink>
            }

            <div
              id={SIGN_OUT_ELEMENT_ID}
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
// export default Navbar;
export default connect(null, { logout })(Navbar);
