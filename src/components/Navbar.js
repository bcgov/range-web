import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Avatar } from './common';
import * as Routes from '../constants/routes';
import { IMAGE_SRC, ELEMENT_ID } from '../constants/variables';
import { SITEMINDER_LOGOUT_ENDPOINT } from '../constants/API';
import { getUser } from '../reducers/rootReducer';
import { isUserAdmin, isUserActive } from '../utils';
import { signOut } from '../actionCreators';

const propTypes = {
  user: PropTypes.shape({}),
  signOut: PropTypes.func.isRequired,
};
const defaultProps = {
  user: undefined,
};

/* eslint-disable jsx-a11y/anchor-is-valid */
export class Navbar extends Component {
  onLogoutBtnClick = () => {
    this.props.signOut();

    // open a new tab for signing out from SiteMinder which is Gov's auth platform
    // once it returns back, it will sign out from SSO which will happen in ReturnPage.js
    window.open(SITEMINDER_LOGOUT_ENDPOINT, '_blank');
  }

  render() {
    const { user } = this.props;

    return (
      <nav className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <img className="navbar__logo" src={IMAGE_SRC.NAV_LOGO} alt="Logo" />
            <Link to={Routes.HOME}>
              <div className="navbar__title">My Range App</div>
            </Link>
          </div>

          <div className="navbar__right">
            { isUserActive(user) &&
              <NavLink
                to={Routes.HOME}
                className="navbar__link"
                activeClassName="navbar__link--active"
              >
                Select RUP
              </NavLink>
            }
            { isUserAdmin(user) &&
              <NavLink
                to={Routes.MANAGE_ZONE}
                className="navbar__link"
                activeClassName="navbar__link--active"
              >
                Manage Zone
              </NavLink>
            }
            { isUserAdmin(user) &&
              <NavLink
                to={Routes.MANAGE_CLIENT}
                className="navbar__link"
                activeClassName="navbar__link--active"
              >
                Manage Client
              </NavLink>
            }
            <div
              id={ELEMENT_ID.SIGN_OUT}
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

const mapStateToProps = state => (
  {
    user: getUser(state),
  }
);
Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;
export default connect(mapStateToProps, { signOut })(Navbar);
