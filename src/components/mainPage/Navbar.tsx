import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { Dropdown, Icon } from 'semantic-ui-react';
import { Avatar } from '../common';
import * as Routes from '../../constants/routes';
import { IMAGE_SRC, ELEMENT_ID } from '../../constants/variables';
import { canManageClients, canManageEmails, canAssignRoles, signOutFromSSOAndSiteMinder } from '../../utils';
import { signOut } from '../../actionCreators';
import {
  SELECT_RUP,
  MANAGE_CLIENTS,
  MERGE_ACCOUNT,
  EMAIL_TEMPLATE,
  ASSIGN_ROLES_AND_DISTRICTS,
} from '../../constants/strings';
import { AppDispatch } from '../../configureStore';

interface NavbarProps {
  user?: any;
  history?: any;
  [key: string]: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const dispatch = useDispatch<AppDispatch>();

  const onLogoutBtnClick = () => {
    dispatch(signOut() as any);
    signOutFromSSOAndSiteMinder();
  };

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
            className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
          >
            {SELECT_RUP}
            <div className="navbar__link__underline" />
          </NavLink>

          <>
            {canManageClients(user) && (
              <>
                <NavLink
                  to={Routes.MANAGE_CLIENT}
                  className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
                >
                  {MANAGE_CLIENTS}
                  <div className="navbar__link__underline" />
                </NavLink>
                <NavLink
                  to={Routes.MERGE_ACCOUNT}
                  className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
                >
                  {MERGE_ACCOUNT}
                  <div className="navbar__link__underline" />
                </NavLink>
              </>
            )}
            {canManageEmails(user) && (
              <NavLink
                to={Routes.EMAIL_TEMPLATE}
                className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
              >
                {EMAIL_TEMPLATE}
                <div className="navbar__link__underline" />
              </NavLink>
            )}
            {canAssignRoles(user) && (
              <>
                <NavLink
                  to={Routes.ASSIGN_ROLES_AND_DISTRICTS}
                  className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
                >
                  {ASSIGN_ROLES_AND_DISTRICTS}
                  <div className="navbar__link__underline" />
                </NavLink>
              </>
            )}
          </>

          <Dropdown
            className="navbar__avatar"
            pointing="top"
            icon={null}
            trigger={
              <>
                <Avatar user={user} />
                <Icon name="angle down" style={{ marginRight: '-4px' }} />
              </>
            }
          >
            <Dropdown.Menu>
              <Dropdown.Item
                id={ELEMENT_ID.SIGN_OUT}
                text="Sign Out"
                icon="sign-out"
                onClick={onLogoutBtnClick}
              />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
