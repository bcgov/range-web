import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { Avatar } from '../common';
import * as Routes from '../../constants/routes';
import { IMAGE_SRC, ELEMENT_ID } from '../../constants/variables';
import { isUserAdmin, signOutFromSSO } from '../../utils';
import { signOut } from '../../actionCreators';
import { SELECT_RUP, MANAGE_ZONES, MANAGE_CLIENTS } from '../../constants/strings';

export class Navbar extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    signOut: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  }

  onNavigate = route => () => {
    this.props.history.push(route);
  }

  onLogoutBtnClick = () => {
    this.props.signOut();
    signOutFromSSO();
  }

  render() {
    const { user } = this.props;

    return (
      <nav className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <Link to={Routes.HOME}>
              <img className="navbar__logo" src={IMAGE_SRC.NAV_LOGO} alt="Logo" />
            </Link>
          </div>

          <div className="navbar__right">
            <NavLink
              to={Routes.HOME}
              className="navbar__link"
              activeClassName="navbar__link--active"
            >
              {SELECT_RUP}
            </NavLink>

            {isUserAdmin(user) &&
              <Fragment>
                <NavLink
                  to={Routes.MANAGE_ZONE}
                  className="navbar__link"
                  activeClassName="navbar__link--active"
                >
                  {MANAGE_ZONES}
                </NavLink>
                <NavLink
                  to={Routes.MANAGE_CLIENT}
                  className="navbar__link"
                  activeClassName="navbar__link--active"
                >
                  {MANAGE_CLIENTS}
                </NavLink>
                {/* <Dropdown className="navbar__menu" text="Menu">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      text="Manage Zone"
                      onClick={this.onNavigate(Routes.MANAGE_ZONE)}
                    />
                    <Dropdown.Item
                      text="Manage Client"
                      onClick={this.onNavigate(Routes.MANAGE_CLIENT)}
                    />
                  </Dropdown.Menu>
                </Dropdown> */}
              </Fragment>
            }

            <Dropdown
              className="navbar__avatar"
              pointing="top"
              icon={null}
              trigger={
                <Avatar
                  user={user}
                />
              }
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  id={ELEMENT_ID.SIGN_OUT}
                  text="Sign Out"
                  icon="sign-out"
                  onClick={this.onLogoutBtnClick}
                />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>
    );
  }
}

export default connect(null, { signOut })(Navbar);
