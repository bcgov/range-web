import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Dropdown, Icon } from 'semantic-ui-react';
import { Avatar } from '../common';
import * as Routes from '../../constants/routes';
import { IMAGE_SRC, ELEMENT_ID } from '../../constants/variables';
import {
  isUserAdmin,
  isUserAgreementHolder,
  signOutFromSSOAndSiteMinder,
} from '../../utils';
import { signOut } from '../../actionCreators';
import {
  SELECT_RUP,
  MANAGE_CLIENTS,
  MERGE_ACCOUNT,
  EMAIL_TEMPLATE,
} from '../../constants/strings';

export class Navbar extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    signOut: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  };

  onNavigate = (route) => () => {
    this.props.history.push(route);
  };

  onLogoutBtnClick = () => {
    this.props.signOut();
    signOutFromSSOAndSiteMinder();
  };

  render() {
    const { user } = this.props;

    return (
      <nav className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <Link to={Routes.HOME}>
              <div className="navbar__logo">
                <img src={IMAGE_SRC.MYRANGEBC_LOGO_DARK} alt="Logo" />
              </div>
            </Link>
          </div>

          <div className="navbar__right">
            <NavLink
              to={Routes.HOME}
              className="navbar__link"
              activeClassName="navbar__link--active"
            >
              {SELECT_RUP}
              <div className="navbar__link__underline" />
            </NavLink>

            <Fragment>
              {/*
                <NavLink
                  to={Routes.MANAGE_ZONE}
                  className="navbar__link"
                  activeClassName="navbar__link--active">
                  {MANAGE_ZONES}
                  <div className="navbar__link__underline" />
                </NavLink>
                */}
              {!isUserAgreementHolder(user) && (
                <>
                  <NavLink
                    to={Routes.MANAGE_CLIENT}
                    className="navbar__link"
                    activeClassName="navbar__link--active"
                  >
                    {MANAGE_CLIENTS}
                    <div className="navbar__link__underline" />
                  </NavLink>
                  <NavLink
                    to={Routes.MERGE_ACCOUNT}
                    className="navbar__link"
                    activeClassName="navbar__link--active"
                  >
                    {MERGE_ACCOUNT}
                    <div className="navbar__link__underline" />
                  </NavLink>
                </>
              )}
              {isUserAdmin(user) && (
                <NavLink
                  to={Routes.EMAIL_TEMPLATE}
                  className="navbar__link"
                  activeClassName="navbar__link--active"
                >
                  {EMAIL_TEMPLATE}
                  <div className="navbar__link__underline" />
                </NavLink>
              )}
            </Fragment>

            <Dropdown
              className="navbar__avatar"
              pointing="top"
              icon={null}
              trigger={
                <Fragment>
                  <Avatar user={user} />
                  <Icon name="angle down" style={{ marginRight: '-4px' }} />
                  {/* <Icon name="caret down" style={{ marginRight: '-4px' }} /> */}
                </Fragment>
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
